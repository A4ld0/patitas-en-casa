require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth'); // login, registro
const mascotasRoutes = require('./routes/mascotas'); // CRUD de mascotas
const usuarioRoutes = require('./routes/usuarios');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotasRoutes);


//app.use('/api/mascotas', mascotasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
