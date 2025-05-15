require('dotenv').config();
const express = require('express');
require('./config/nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const path = require('path');
// 1) Sirve estáticos (css, js, imágenes…)
app.use(express.static(path.join(__dirname, 'public')));

// 2) Catch-all para SPA (cualquier ruta no-API devuelve tu HTML)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'alarmas.html'));
});

const authRoutes = require('./routes/auth');          // login, registro
const mascotasRoutes = require('./routes/mascotas');  // CRUD de mascotas
const usuarioRoutes = require('./routes/usuarios');   // CRUD de usuarios
const alarmasRoutes = require('./routes/alarmasRoutes'); // CRUD de alarmas
const { verificarToken } = require('./Middlewares/authMiddleware'); // Middleware para verificar token
const adopcionesRoutes = require('./routes/adopciones');
const mensajeAdopcionRouter = require('./routes/mensajeAdopcion');


app.use(cors());
app.use(express.json());

app.use('/api/mensaje-adopcion', mensajeAdopcionRouter);
// Rutas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas protegidas
console.log('verificarToken is:', typeof verificarToken);
app.use(verificarToken);

// Rutas protegidas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/alarmas', alarmasRoutes);
app.use('/api/adopciones', adopcionesRoutes);


// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});