const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const User = require('./models/User');
const app = express();

// Configuración
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para soportar PUT y DELETE

// Configurar EJS y Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout'); // Layout por defecto

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/usuarios', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Rutas
app.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuarios');
    }
});

// CREATE
app.get('/users/new', (req, res) => {
    res.render('create');
});

// CREATE
app.post('/users', async (req, res) => {
    try {
        const { correo, password, nombre, rol } = req.body;
        await User.create({ correo, password, nombre, rol });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).send('El correo ya está registrado');
        } else {
            res.status(500).send('Error al crear usuario');
        }
    }
});

// READ
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.render('show', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuario');
    }
});

// UPDATE
app.get('/users/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.render('edit', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuario');
    }
});

// UPDATE
app.put('/users/:id', async (req, res) => {
    try {
        const { correo, password, nombre, rol } = req.body;
        
        // Si no se proporciona password, no lo actualizamos
        const updateData = { correo, nombre, rol };
        if ((password || '').trim() !== '') {
            updateData.password = password;
        }
        
        await User.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).send('El correo ya está registrado');
        } else {
            res.status(500).send('Error al actualizar usuario');
        }
    }
});

// DELETE
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar usuario');
    }
});

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});