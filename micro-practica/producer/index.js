require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE_NAME || 'email_queue';
const PORT = process.env.PORT || 3000;

let channel;

async function initRabbit() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    console.log('✅ Conectado a RabbitMQ en', RABBITMQ_URL, 'cola:', QUEUE);

    process.on('SIGINT', async () => {
      try { 
        await channel.close(); 
        await conn.close(); 
      } catch(e) {}
      process.exit(0);
    });
  } catch (err) {
    console.error('Error conectando a RabbitMQ', err);
    process.exit(1);
  }
}

async function startServer() {
  await initRabbit();

  const app = express();
  
  // ⚠️ IMPORTANTE: Estos middlewares DEBEN ir ANTES de las rutas
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // Agrega esta línea también

  const users = [];

  app.post('/register', async (req, res) => {
    const { name, email, cell } = req.body;
    
    if (!name || !email || !cell) {
      return res.status(400).json({ error: 'Faltan campos: name, email, cell' });
    }

    const user = {
      id: Date.now(),
      name,
      email,
      cell,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    const payload = { type: 'NEW_USER', user };

    try {
      channel.sendToQueue(
        QUEUE, 
        Buffer.from(JSON.stringify(payload)), 
        { persistent: true }
      );
      console.log('📤 Mensaje enviado a la cola:', payload);
      return res.status(201).json({ ok: true, user });
    } catch (err) {
      console.error('❌ Error publicando en la cola', err);
      return res.status(500).json({ error: 'No se pudo enviar a la cola' });
    }
  });

  app.get('/users', (req, res) => res.json(users));

  app.listen(PORT, () => {
    console.log(`Producer API en http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fallo al iniciar producer', err);
  process.exit(1);
});