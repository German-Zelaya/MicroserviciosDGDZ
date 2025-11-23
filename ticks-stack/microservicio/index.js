const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;

// Métricas
let metrics = {
  requests_total: 0,
  errorCount: 0,
  successCount: 0
};

// Datos de ejemplo
const personas = [
  { id: 1, nombre: "Juan Pérez", edad: 30 },
  { id: 2, nombre: "María García", edad: 25 },
  { id: 3, nombre: "Carlos López", edad: 35 }
];

// Función para enviar métricas a Telegraf
async function enviarMetricas() {
  try {
    await axios.post('http://telegraf:8080/telegraf', metrics);
    console.log('Métricas enviadas:', metrics);
  } catch (error) {
    console.error('Error enviando métricas:', error.message);
  }
}

// Enviar métricas cada 5 segundos
setInterval(enviarMetricas, 5000);

// Middleware para contar requests
app.use((req, res, next) => {
  metrics.requests_total++;
  next();
});

// Endpoints
app.get('/personas', (req, res) => {
  metrics.successCount++;
  res.json(personas);
});

app.get('/error', (req, res) => {
  metrics.errorCount++;
  res.status(500).json({ error: "Error simulado" });
});

app.get('/metrics', (req, res) => {
  res.json(metrics);
});

app.get('/health', (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Microservicio corriendo en puerto ${PORT}`);
});