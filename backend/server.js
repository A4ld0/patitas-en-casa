require('dotenv').config();
const express = require('express');
require('./config/nodemailer');             // configura transport de correo
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');

const { verificarToken } = require('./Middlewares/authMiddleware');
const authRoutes            = require('./routes/auth');
const mascotasRoutes        = require('./routes/mascotas');
const usuarioRoutes         = require('./routes/usuarios');
const alarmasRoutes         = require('./routes/alarmasRoutes');
const adopcionesRoutes      = require('./routes/adopciones');
const mensajeAdopcionRouter = require('./routes/mensajeAdopcion');

const app = express();

// 1) Middlewares globales
app.use(cors());
app.use(express.json());

// 2) Rutas públicas
app.use('/api/mensaje-adopcion', mensajeAdopcionRouter);
app.use('/api/auth',            authRoutes);

// 3) Rutas protegidas (cada una con su propio verificarToken)
app.use('/api/usuarios',   verificarToken, usuarioRoutes);
app.use('/api/mascotas',   verificarToken, mascotasRoutes);
app.use('/api/alarmas',    verificarToken, alarmasRoutes);
app.use('/api/adopciones', verificarToken, adopcionesRoutes);

// 4) History API fallback para SPA (ignora rutas /api)
app.use(history({
  rewrites: [
    { from: /^\/api\/.*$/, to: context => context.parsedUrl.path }
  ]
}));

// 5) Sirve estáticos (css, js, imágenes…)
app.use(express.static(path.join(__dirname, 'public')));

// 6) Conexión a MongoDB y arranque
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
