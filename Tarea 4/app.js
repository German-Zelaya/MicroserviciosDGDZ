const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Base de datos en memoria (arrays simples)
let productos = [];
let clientes = [];
let facturas = [];
let detallesFacturas = [];

// Contadores para IDs
let productoIdCounter = 1;
let clienteIdCounter = 1;
let facturaIdCounter = 1;
let detalleIdCounter = 1;

// MIDDLEWARE DE VALIDACIÓN
const validateProducto = (req, res, next) => {
    const { nombre, descripcion, marca, stock } = req.body;
    if (!nombre || !descripcion || !marca || stock === undefined) {
        return res.status(400).json({ 
            error: 'Campos requeridos: nombre, descripcion, marca, stock' 
        });
    }
    if (stock < 0) {
        return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }
    next();
};

const validateCliente = (req, res, next) => {
    const { ci, nombres, apellidos, sexo } = req.body;
    if (!ci || !nombres || !apellidos || !sexo) {
        return res.status(400).json({ 
            error: 'Campos requeridos: ci, nombres, apellidos, sexo' 
        });
    }
    next();
};

// =====================================
// GESTIÓN DE PRODUCTOS
// =====================================

// Crear producto
app.post('/api/productos', validateProducto, (req, res) => {
    const { nombre, descripcion, marca, stock } = req.body;
    
    const producto = {
        id: productoIdCounter++,
        nombre,
        descripcion,
        marca,
        stock: parseInt(stock),
        fechaCreacion: new Date().toISOString()
    };
    
    productos.push(producto);
    res.status(201).json(producto);
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const { page = 1, limit = 10, nombre, marca } = req.query;
    let result = [...productos];
    
    // Filtros
    if (nombre) {
        result = result.filter(p => 
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }
    if (marca) {
        result = result.filter(p => 
            p.marca.toLowerCase().includes(marca.toLowerCase())
        );
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResult = result.slice(startIndex, endIndex);
    
    res.json({
        productos: paginatedResult,
        total: result.length,
        page: parseInt(page),
        totalPages: Math.ceil(result.length / limit)
    });
});

// Obtener producto por ID
app.get('/api/productos/:id', (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
});

// Actualizar producto
app.put('/api/productos/:id', validateProducto, (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const { nombre, descripcion, marca, stock } = req.body;
    productos[index] = {
        ...productos[index],
        nombre,
        descripcion,
        marca,
        stock: parseInt(stock),
        fechaActualizacion: new Date().toISOString()
    };
    
    res.json(productos[index]);
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    productos.splice(index, 1);
    res.status(204).send();
});

// =====================================
// GESTIÓN DE CLIENTES
// =====================================

// Crear cliente
app.post('/api/clientes', validateCliente, (req, res) => {
    const { ci, nombres, apellidos, sexo } = req.body;
    
    // Verificar CI único
    const existeCI = clientes.find(c => c.ci === ci);
    if (existeCI) {
        return res.status(400).json({ error: 'Ya existe un cliente con ese CI' });
    }
    
    const cliente = {
        id: clienteIdCounter++,
        ci,
        nombres,
        apellidos,
        sexo,
        fechaCreacion: new Date().toISOString()
    };
    
    clientes.push(cliente);
    res.status(201).json(cliente);
});

// Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    const { page = 1, limit = 10, nombres, apellidos } = req.query;
    let result = [...clientes];
    
    // Filtros
    if (nombres) {
        result = result.filter(c => 
            c.nombres.toLowerCase().includes(nombres.toLowerCase())
        );
    }
    if (apellidos) {
        result = result.filter(c => 
            c.apellidos.toLowerCase().includes(apellidos.toLowerCase())
        );
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResult = result.slice(startIndex, endIndex);
    
    res.json({
        clientes: paginatedResult,
        total: result.length,
        page: parseInt(page),
        totalPages: Math.ceil(result.length / limit)
    });
});

// Obtener cliente por ID
app.get('/api/clientes/:id', (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.params.id));
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
});

// Actualizar cliente
app.put('/api/clientes/:id', validateCliente, (req, res) => {
    const id = parseInt(req.params.id);
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const { ci, nombres, apellidos, sexo } = req.body;
    
    // Verificar CI único (excluyendo el actual)
    const existeCI = clientes.find(c => c.ci === ci && c.id !== id);
    if (existeCI) {
        return res.status(400).json({ error: 'Ya existe un cliente con ese CI' });
    }
    
    clientes[index] = {
        ...clientes[index],
        ci,
        nombres,
        apellidos,
        sexo,
        fechaActualizacion: new Date().toISOString()
    };
    
    res.json(clientes[index]);
});

// Eliminar cliente
app.delete('/api/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Verificar si tiene facturas asociadas
    const tieneFacturas = facturas.some(f => f.cliente_id === id);
    if (tieneFacturas) {
        return res.status(400).json({ 
            error: 'No se puede eliminar el cliente porque tiene facturas asociadas' 
        });
    }
    
    clientes.splice(index, 1);
    res.status(204).send();
});

// =====================================
// GESTIÓN DE FACTURAS
// =====================================

// Crear factura
app.post('/api/facturas', (req, res) => {
    const { fecha, cliente_id } = req.body;
    
    if (!fecha || !cliente_id) {
        return res.status(400).json({ 
            error: 'Campos requeridos: fecha, cliente_id' 
        });
    }
    
    // Verificar que el cliente existe
    const cliente = clientes.find(c => c.id === parseInt(cliente_id));
    if (!cliente) {
        return res.status(400).json({ error: 'Cliente no encontrado' });
    }
    
    const factura = {
        id: facturaIdCounter++,
        fecha,
        cliente_id: parseInt(cliente_id),
        total: 0,
        fechaCreacion: new Date().toISOString()
    };
    
    facturas.push(factura);
    res.status(201).json(factura);
});

// Obtener todas las facturas
app.get('/api/facturas', (req, res) => {
    const { page = 1, limit = 10, cliente_id } = req.query;
    let result = [...facturas];
    
    // Filtro por cliente
    if (cliente_id) {
        result = result.filter(f => f.cliente_id === parseInt(cliente_id));
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResult = result.slice(startIndex, endIndex);
    
    // Agregar información del cliente
    const facturasConCliente = paginatedResult.map(factura => {
        const cliente = clientes.find(c => c.id === factura.cliente_id);
        return {
            ...factura,
            cliente: cliente ? `${cliente.nombres} ${cliente.apellidos}` : 'Cliente no encontrado'
        };
    });
    
    res.json({
        facturas: facturasConCliente,
        total: result.length,
        page: parseInt(page),
        totalPages: Math.ceil(result.length / limit)
    });
});

// Obtener factura por ID
app.get('/api/facturas/:id', (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) {
        return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    // Agregar información del cliente
    const cliente = clientes.find(c => c.id === factura.cliente_id);
    const facturaConCliente = {
        ...factura,
        cliente: cliente ? `${cliente.nombres} ${cliente.apellidos}` : 'Cliente no encontrado'
    };
    
    res.json(facturaConCliente);
});

// Obtener facturas de un cliente específico
app.get('/api/clientes/:id/facturas', (req, res) => {
    const cliente_id = parseInt(req.params.id);
    
    // Verificar que el cliente existe
    const cliente = clientes.find(c => c.id === cliente_id);
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const facturasCliente = facturas.filter(f => f.cliente_id === cliente_id);
    res.json({
        cliente: `${cliente.nombres} ${cliente.apellidos}`,
        facturas: facturasCliente
    });
});

// Actualizar factura
app.put('/api/facturas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = facturas.findIndex(f => f.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    const { fecha, cliente_id } = req.body;
    
    if (!fecha || !cliente_id) {
        return res.status(400).json({ 
            error: 'Campos requeridos: fecha, cliente_id' 
        });
    }
    
    // Verificar que el cliente existe
    const cliente = clientes.find(c => c.id === parseInt(cliente_id));
    if (!cliente) {
        return res.status(400).json({ error: 'Cliente no encontrado' });
    }
    
    facturas[index] = {
        ...facturas[index],
        fecha,
        cliente_id: parseInt(cliente_id),
        fechaActualizacion: new Date().toISOString()
    };
    
    res.json(facturas[index]);
});

// Eliminar factura
app.delete('/api/facturas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = facturas.findIndex(f => f.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    // Eliminar también los detalles de la factura
    detallesFacturas = detallesFacturas.filter(d => d.factura_id !== id);
    
    facturas.splice(index, 1);
    res.status(204).send();
});

// =====================================
// GESTIÓN DE DETALLES DE FACTURAS
// =====================================

// Añadir detalle a una factura
app.post('/api/facturas/:id/detalles', (req, res) => {
    const factura_id = parseInt(req.params.id);
    const { producto_id, cantidad, precio } = req.body;
    
    if (!producto_id || !cantidad || !precio) {
        return res.status(400).json({ 
            error: 'Campos requeridos: producto_id, cantidad, precio' 
        });
    }
    
    // Verificar que la factura existe
    const factura = facturas.find(f => f.id === factura_id);
    if (!factura) {
        return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    // Verificar que el producto existe
    const producto = productos.find(p => p.id === parseInt(producto_id));
    if (!producto) {
        return res.status(400).json({ error: 'Producto no encontrado' });
    }
    
    // Verificar stock suficiente
    if (producto.stock < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
    }
    
    const detalle = {
        id: detalleIdCounter++,
        factura_id,
        producto_id: parseInt(producto_id),
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        subtotal: parseInt(cantidad) * parseFloat(precio),
        fechaCreacion: new Date().toISOString()
    };
    
    detallesFacturas.push(detalle);
    
    // Actualizar stock del producto
    producto.stock -= cantidad;
    
    // Actualizar total de la factura
    const totalFactura = detallesFacturas
        .filter(d => d.factura_id === factura_id)
        .reduce((sum, d) => sum + d.subtotal, 0);
    
    factura.total = totalFactura;
    
    res.status(201).json(detalle);
});

// Obtener detalles de una factura específica
app.get('/api/facturas/:id/detalles', (req, res) => {
    const factura_id = parseInt(req.params.id);
    
    // Verificar que la factura existe
    const factura = facturas.find(f => f.id === factura_id);
    if (!factura) {
        return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    const detalles = detallesFacturas
        .filter(d => d.factura_id === factura_id)
        .map(detalle => {
            const producto = productos.find(p => p.id === detalle.producto_id);
            return {
                ...detalle,
                producto: producto ? producto.nombre : 'Producto no encontrado'
            };
        });
    
    res.json({
        factura_id,
        detalles,
        total: factura.total
    });
});

// Actualizar detalle de factura
app.put('/api/detalles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = detallesFacturas.findIndex(d => d.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Detalle no encontrado' });
    }
    
    const { cantidad, precio } = req.body;
    
    if (!cantidad || !precio) {
        return res.status(400).json({ 
            error: 'Campos requeridos: cantidad, precio' 
        });
    }
    
    const detalleAnterior = detallesFacturas[index];
    const producto = productos.find(p => p.id === detalleAnterior.producto_id);
    
    // Restaurar stock anterior
    producto.stock += detalleAnterior.cantidad;
    
    // Verificar nuevo stock
    if (producto.stock < cantidad) {
        // Restaurar el estado si no hay suficiente stock
        producto.stock -= detalleAnterior.cantidad;
        return res.status(400).json({ error: 'Stock insuficiente' });
    }
    
    // Actualizar detalle
    detallesFacturas[index] = {
        ...detalleAnterior,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        subtotal: parseInt(cantidad) * parseFloat(precio),
        fechaActualizacion: new Date().toISOString()
    };
    
    // Actualizar stock
    producto.stock -= cantidad;
    
    // Actualizar total de factura
    const factura = facturas.find(f => f.id === detalleAnterior.factura_id);
    const totalFactura = detallesFacturas
        .filter(d => d.factura_id === detalleAnterior.factura_id)
        .reduce((sum, d) => sum + d.subtotal, 0);
    
    factura.total = totalFactura;
    
    res.json(detallesFacturas[index]);
});

// Eliminar detalle de factura
app.delete('/api/detalles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = detallesFacturas.findIndex(d => d.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Detalle no encontrado' });
    }
    
    const detalle = detallesFacturas[index];
    
    // Restaurar stock
    const producto = productos.find(p => p.id === detalle.producto_id);
    producto.stock += detalle.cantidad;
    
    // Actualizar total de factura
    const factura = facturas.find(f => f.id === detalle.factura_id);
    factura.total -= detalle.subtotal;
    
    detallesFacturas.splice(index, 1);
    res.status(204).send();
});

// =====================================
// RUTAS DE INFORMACIÓN
// =====================================

// Ruta principal con documentación básica
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API RESTful Sistema de Ventas',
        version: '1.0.0',
        endpoints: {
            productos: '/api/productos',
            clientes: '/api/clientes',
            facturas: '/api/facturas',
            detalles: '/api/facturas/:id/detalles'
        },
        documentacion: '/api/docs'
    });
});

// Documentación básica de la API
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'Sistema de Ventas API',
        version: '1.0.0',
        description: 'API RESTful para gestionar productos, clientes, facturas y detalles de facturas',
        endpoints: {
            productos: {
                'POST /api/productos': 'Crear producto',
                'GET /api/productos': 'Obtener todos los productos (con paginación y filtros)',
                'GET /api/productos/:id': 'Obtener producto por ID',
                'PUT /api/productos/:id': 'Actualizar producto',
                'DELETE /api/productos/:id': 'Eliminar producto'
            },
            clientes: {
                'POST /api/clientes': 'Crear cliente',
                'GET /api/clientes': 'Obtener todos los clientes (con paginación y filtros)',
                'GET /api/clientes/:id': 'Obtener cliente por ID',
                'PUT /api/clientes/:id': 'Actualizar cliente',
                'DELETE /api/clientes/:id': 'Eliminar cliente'
            },
            facturas: {
                'POST /api/facturas': 'Crear factura',
                'GET /api/facturas': 'Obtener todas las facturas (con paginación y filtros)',
                'GET /api/facturas/:id': 'Obtener factura por ID',
                'GET /api/clientes/:id/facturas': 'Obtener facturas de un cliente',
                'PUT /api/facturas/:id': 'Actualizar factura',
                'DELETE /api/facturas/:id': 'Eliminar factura'
            },
            detalles: {
                'POST /api/facturas/:id/detalles': 'Añadir detalle a factura',
                'GET /api/facturas/:id/detalles': 'Obtener detalles de una factura',
                'PUT /api/detalles/:id': 'Actualizar detalle',
                'DELETE /api/detalles/:id': 'Eliminar detalle'
            }
        },
        parametros_consulta: {
            paginacion: 'page (número de página), limit (elementos por página)',
            filtros: 'Varía según el endpoint (nombre, marca, apellidos, etc.)'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint no encontrado',
        mensaje: 'Consulta /api/docs para ver los endpoints disponibles'
    });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        mensaje: 'Algo salió mal en el servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📖 Documentación disponible en http://localhost:${PORT}/api/docs`);
});

module.exports = app;