import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";

// Cargar el proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// Base de datos en memoria
const estudiantes = [];
const cursos = [];
const inscripciones = []; // Array de objetos: { ci, codigo }

// Implementación de los métodos
const serviceImpl = {
  AgregarEstudiante: (call, callback) => {
    const nuevo = call.request;
    
    // Verificar si el estudiante ya existe
    const existe = estudiantes.find(e => e.ci === nuevo.ci);
    if (existe) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "El estudiante ya existe"
      });
      return;
    }
    
    estudiantes.push(nuevo);
    console.log(`Estudiante agregado: ${nuevo.nombres} ${nuevo.apellidos}`);
    callback(null, { estudiante: nuevo });
  },

  AgregarCurso: (call, callback) => {
    const nuevo = call.request;
    
    // Verificar si el curso ya existe
    const existe = cursos.find(c => c.codigo === nuevo.codigo);
    if (existe) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "El curso ya existe"
      });
      return;
    }
    
    cursos.push(nuevo);
    console.log(`Curso agregado: ${nuevo.nombre}`);
    callback(null, { curso: nuevo });
  },

  InscribirEstudiante: (call, callback) => {
    const { ci, codigo } = call.request;
    
    // Verificar que el estudiante existe
    const estudiante = estudiantes.find(e => e.ci === ci);
    if (!estudiante) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Estudiante no encontrado"
      });
      return;
    }
    
    // Verificar que el curso existe
    const curso = cursos.find(c => c.codigo === codigo);
    if (!curso) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Curso no encontrado"
      });
      return;
    }
    
    // Verificar si ya está inscrito
    const yaInscrito = inscripciones.find(
      i => i.ci === ci && i.codigo === codigo
    );
    
    if (yaInscrito) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "El estudiante ya está inscrito en este curso"
      });
      return;
    }
    
    // Realizar la inscripción
    inscripciones.push({ ci, codigo });
    console.log(`${estudiante.nombres} inscrito en ${curso.nombre}`);
    
    callback(null, {
      mensaje: "Inscripción exitosa",
      estudiante: estudiante,
      curso: curso
    });
  },

  ListarCursosDeEstudiante: (call, callback) => {
    const { ci } = call.request;
    
    // Verificar que el estudiante existe
    const estudiante = estudiantes.find(e => e.ci === ci);
    if (!estudiante) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Estudiante no encontrado"
      });
      return;
    }
    
    // Obtener los códigos de cursos en los que está inscrito
    const codigosCursos = inscripciones
      .filter(i => i.ci === ci)
      .map(i => i.codigo);
    
    // Obtener los cursos completos
    const cursosEstudiante = cursos.filter(c => 
      codigosCursos.includes(c.codigo)
    );
    
    callback(null, { cursos: cursosEstudiante });
  },

  ListarEstudiantesDeCurso: (call, callback) => {
    const { codigo } = call.request;
    
    // Verificar que el curso existe
    const curso = cursos.find(c => c.codigo === codigo);
    if (!curso) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Curso no encontrado"
      });
      return;
    }
    
    // Obtener los CI de estudiantes inscritos en el curso
    const cisEstudiantes = inscripciones
      .filter(i => i.codigo === codigo)
      .map(i => i.ci);
    
    // Obtener los estudiantes completos
    const estudiantesCurso = estudiantes.filter(e => 
      cisEstudiantes.includes(e.ci)
    );
    
    callback(null, { estudiantes: estudiantesCurso });
  }
};

// Crear servidor
const server = new grpc.Server();
server.addService(proto.UniversidadService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) {
      console.error("Error al iniciar servidor:", err);
      return;
    }
    console.log(`✅ Servidor gRPC escuchando en puerto ${bindPort}`);
    server.start();
  }
);