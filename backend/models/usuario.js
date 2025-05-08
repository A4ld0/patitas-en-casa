const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  estado: { type: String },
  municipio: { type: String },
  codigoPostal: { type: String },
  fechaNacimiento: { type: Date },
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
