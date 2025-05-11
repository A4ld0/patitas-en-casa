const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlarmaSchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  especie: { type: String },            
  raza:    { type: String },            
  edadMax: { type: Number },            
  sexo:    { type: String, enum: ['M','H'] },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'alarmas'
});

module.exports = mongoose.model('Alarma', AlarmaSchema);
