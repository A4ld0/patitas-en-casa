const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlarmaSchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  especie: { type: String },            
  raza:    { type: String },            
  color:   { type: String },            // <--- agregado
  ciudad:  { type: String },            // <--- agregado
  edadMax: { type: Number },            
  sexo:    { type: String, enum: ['Macho','Hembra'] },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'alarmas'
});

module.exports = mongoose.model('Alarma', AlarmaSchema);
