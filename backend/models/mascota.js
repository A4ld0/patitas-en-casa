const mongoose = require('mongoose');

const mascotaSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  raza: String,
  edad: String,
  sexo: String,
  color: String,
  vacunado: String,
  esterilizado: String,
  imagen: String,
  observaciones: String,
  estado: String,
  locacion: String,
  fecha: String
});

module.exports = mongoose.model('Mascota', mascotaSchema);
