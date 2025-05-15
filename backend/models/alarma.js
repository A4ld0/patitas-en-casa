const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlarmaSchema = new Schema({
  user:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tipo:     { type: String, required: true },                       // perro, gato…
  sexo:     { type: String, enum: ['Macho','Hembra'], required: true },
  edadMax:  { type: Number, required: true },                       // años máximos
  createdAt:{ type: Date, default: Date.now }
}, {
  collection: 'alarmas'
});

module.exports = mongoose.model('Alarma', AlarmaSchema);
