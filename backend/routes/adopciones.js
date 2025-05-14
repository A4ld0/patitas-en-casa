// routes/adopciones.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middlewares/authMiddleware');
const Adopcion = require('../models/adopcion');

// Crear adopción
router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, telefono, motivo, mascotaId } = req.body;

    const nuevaAdopcion = new Adopcion({
      nombre,
      telefono,
      motivo,
      mascota: mascotaId,
      usuario: req.usuario.id  // ✅ CORREGIDO
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

module.exports = router;
