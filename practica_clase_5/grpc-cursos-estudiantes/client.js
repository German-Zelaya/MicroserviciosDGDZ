import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";

// Cargar el proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// Crear cliente
const client = new proto.UniversidadService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Función auxiliar para hacer promesas de las llamadas gRPC
const promisify = (fn) => {
  return (args) => {
    return new Promise((resolve, reject) => {
      fn(args, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  };
};

// Convertir métodos a promesas
const agregarEstudiante = promisify(client.AgregarEstudiante.bind(client));
const agregarCurso = promisify(client.AgregarCurso.bind(client));
const inscribirEstudiante = promisify(client.InscribirEstudiante.bind(client));
const listarCursosDeEstudiante = promisify(client.ListarCursosDeEstudiante.bind(client));
const listarEstudiantesDeCurso = promisify(client.ListarEstudiantesDeCurso.bind(client));

// Función principal para demostrar el sistema
async function demo() {
  try {
    console.log("=== DEMO: Sistema de Gestión Universitaria ===\n");

    // 1. Registrar un estudiante
    console.log("1️⃣  Registrando estudiante...");
    const estudiante1 = await agregarEstudiante({
      ci: "12345",
      nombres: "Daniel",
      apellidos: "De La Torre",
      carrera: "Sistemas"
    });
    console.log("✅ Estudiante agregado:", estudiante1.estudiante);
    console.log();

    // 2. Registrar dos cursos
    console.log("2️⃣  Registrando cursos...");
    const curso1 = await agregarCurso({
      codigo: "SIS-101",
      nombre: "Programación I",
      docente: "Ing. Coca"
    });
    console.log("✅ Curso agregado:", curso1.curso);

    const curso2 = await agregarCurso({
      codigo: "SIS-202",
      nombre: "Base de Datos",
      docente: "Ing. Villafan"
    });
    console.log("✅ Curso agregado:", curso2.curso);
    console.log();

    // 3. Inscribir al estudiante en ambos cursos
    console.log("3️⃣  Inscribiendo estudiante en cursos...");
    const inscripcion1 = await inscribirEstudiante({
      ci: "12345",
      codigo: "SIS-101"
    });
    console.log("✅", inscripcion1.mensaje);
    console.log("   Estudiante:", inscripcion1.estudiante.nombres);
    console.log("   Curso:", inscripcion1.curso.nombre);

    const inscripcion2 = await inscribirEstudiante({
      ci: "12345",
      codigo: "SIS-202"
    });
    console.log("✅", inscripcion2.mensaje);
    console.log("   Estudiante:", inscripcion2.estudiante.nombres);
    console.log("   Curso:", inscripcion2.curso.nombre);
    console.log();

    // 4. Consultar los cursos del estudiante
    console.log("4️⃣  Consultando cursos del estudiante...");
    const cursosEstudiante = await listarCursosDeEstudiante({ ci: "12345" });
    console.log("📚 Cursos de Carlos Montellano:");
    cursosEstudiante.cursos.forEach(curso => {
      console.log(`   - ${curso.codigo}: ${curso.nombre} (${curso.docente})`);
    });
    console.log();

    // 5. Consultar los estudiantes de un curso
    console.log("5️⃣  Consultando estudiantes del curso SIS-101...");
    const estudiantesCurso = await listarEstudiantesDeCurso({ codigo: "SIS-101" });
    console.log("👥 Estudiantes inscritos en Programación I:");
    estudiantesCurso.estudiantes.forEach(est => {
      console.log(`   - ${est.ci}: ${est.nombres} ${est.apellidos} (${est.carrera})`);
    });
    console.log();

    // 6. Probar error: intentar inscribir nuevamente
    console.log("6️⃣  Probando inscripción duplicada...");
    try {
      await inscribirEstudiante({
        ci: "12345",
        codigo: "SIS-101"
      });
    } catch (err) {
      console.log("❌ Error esperado:", err.details);
    }
    console.log();

    console.log("=== FIN DE LA DEMO ===");

  } catch (error) {
    console.error("❌ Error:", error.details || error.message);
  }
}

// Ejecutar la demo
demo();