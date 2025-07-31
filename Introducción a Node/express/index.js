const express = require('express');
const app = express();
const port = 3000;
app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('¡Hola desde Express!');
});

app.post('/usuario', (req, res) => {
    console.log(req.body);
    const { nombre, edad } = req.body;
    res.send(`Usuario creado: ${nombre}, Edad: ${edad}`);
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});