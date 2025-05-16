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

// 2) Tus rutas de API
app.use('/api/mensaje-adopcion', mensajeAdopcionRouter);
app.use('/api/auth',             authRoutes);
app.use('/api/usuarios',   verificarToken, usuarioRoutes);
app.use('/api/mascotas',   verificarToken, mascotasRoutes);
app.use('/api/alarmas',    verificarToken, alarmasRoutes);
app.use('/api/adopciones', verificarToken, adopcionesRoutes);

// 3) Define el path absoluto a public/
const publicPath = path.join(__dirname, '../public');

// Desactivar cache de todos los assets
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});


// 4) Sirve estáticos (JS, CSS, imágenes)
app.use(express.static(publicPath));

// 5) History API Fallback para SPA: reescribe cualquier ruta que no empiece por /api a /
app.use(history({
  rewrites: [
    { from: /^\/api\/.*$/, to: context => context.parsedUrl.path }
  ]
}));

// 6) De nuevo serve estáticos para que history encuentre index.html
app.use(express.static(publicPath));

// 7) Conecta a Mongo y arranca
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
