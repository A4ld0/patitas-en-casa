require('dotenv').config();
const express = require('express');
require('./config/nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');          // login, registro
const mascotasRoutes = require('./routes/mascotas');  // CRUD de mascotas
const usuarioRoutes = require('./routes/usuarios');   // CRUD de usuarios
const alarmasRoutes = require('./routes/alarmasRoutes'); // CRUD de alarmas
const { verificarToken } = require('./Middlewares/authMiddleware'); // Middleware para verificar token

const app = express();
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas protegidas
console.log('verificarToken is:', typeof verificarToken);
app.use(verificarToken);

// Rutas protegidas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/alarmas', alarmasRoutes);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});