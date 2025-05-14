const mongoose = require('mongoose');

const adopcionSchema = new mongoose.Schema({
  mascota: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascota', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nombre: { type: String, required: true },
  motivo: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  email: { type: String, required: true }
}, {
  collection: 'adopciones'  // Fuerza el nombre correcto
});

module.exports = mongoose.model('Adopcion', adopcionSchema);
