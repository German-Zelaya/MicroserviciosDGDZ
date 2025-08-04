const express = require('express');
const app = express();
const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index')});

app.post('/calcular', (req, res) => {
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const suma = num1 + num2;
    res.render('resultado', { suma });
});