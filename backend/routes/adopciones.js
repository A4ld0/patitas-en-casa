// routes/adopciones.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middlewares/authMiddleware');
const Adopcion = require('../models/adopcion');
const Usuario = require('../models/usuario'); // para obtener email
const Mascota = require('../models/mascota');
const nodemailer = require('../config/nodemailer');
// Crear adopción
router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, email, motivo, mascotaId } = req.body;

    const nuevaAdopcion = new Adopcion({
      nombre,
      email,
      motivo,
      mascota: mascotaId,
      usuario: req.usuario.id  
    });

    const guardado = await nuevaAdopcion.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear adopción:', error);
    res.status(500).json({ error: 'Error al registrar la adopción' });
  }
});

// Obtener todas las adopciones (admin)
router.get('/', verificarToken, async (req, res) => {
  try {
    const adopciones = await Adopcion.find()
      .populate('usuario', 'nombre email')   // datos del usuario
      .populate('mascota', 'nombre tipo raza'); // datos de la mascota
    res.json(adopciones);
  } catch (err) {
    console.error('Error al obtener adopciones:', err);
    res.status(500).json({ error: 'Error al obtener adopciones' });
  }
});

//Eliminar adopción y enviar correo
router.delete('/:id', async (req, res) => {
  try {
    const adopcion = await Adopcion.findById(req.params.id)
      .populate('usuario', 'email username')
      .populate('mascota', 'nombre');

    if (!adopcion) return res.status(404).json({ error: 'Adopción no encontrada' });

    const { email } = adopcion.usuario;
    const { nombre: nombreMascota } = adopcion.mascota;
    const estado = req.query.estado; // aceptada o rechazada

    if (!['aceptada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    // Enviar correo
    await nodemailer.sendMail({
      to: email,
      subject: `Adopción de ${nombreMascota} ${estado}`,
      html: `
        <p>Hola ${adopcion.usuario.username},</p>
        <p>Tu solicitud de adopción para <strong>${nombreMascota}</strong> ha sido <strong>${estado}</strong>.</p>
        <p>Gracias por confiar en Patitas en Casa 🐾</p>
      `
    });

    await adopcion.deleteOne();

    res.json({ mensaje: `Adopción ${estado} y eliminada correctamente` });
  } catch (err) {
    console.error('Error en eliminación/adopción:', err);
    res.status(500).json({ error: 'Error al procesar la adopción' });
  }
});



module.exports = router;
