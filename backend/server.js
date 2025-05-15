require('dotenv').config();
const express  = require('express');
const path     = require('path');
const cors     = require('cors');
const history  = require('connect-history-api-fallback');
const mongoose = require('mongoose');

const { verificarToken }      = require('./Middlewares/authMiddleware');
const authRoutes              = require('./routes/auth');
const mensajeAdopcionRouter   = require('./routes/mensajeAdopcion');
const usuarioRoutes           = require('./routes/usuarios');
const mascotasRoutes          = require('./routes/mascotas');
const alarmasRoutes           = require('./routes/alarmasRoutes');
const adopcionesRoutes        = require('./routes/adopciones');

const app = express();

// 1) Middlewares globales
app.use(cors());
app.use(express.json());

// 2) Rutas públicas de la API
app.use('/api/mensaje-adopcion', mensajeAdopcionRouter);
app.use('/api/auth',             authRoutes);

// 3) Rutas protegidas
app.use('/api/usuarios',   verificarToken, usuarioRoutes);
app.use('/api/mascotas',   verificarToken, mascotasRoutes);
app.use('/api/alarmas',    verificarToken, alarmasRoutes);
app.use('/api/adopciones', verificarToken, adopcionesRoutes);

// 4) History API Fallback — cualquier ruta que no empiece por /api se sirve como index.html
app.use(history({
  rewrites: [
    { from: /^\/api\/.*$/, to: context => context.parsedUrl.path }
  ]
}));

// 5) Servir archivos estáticos de la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

// 6) Conectarse a MongoDB y arrancar el servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
