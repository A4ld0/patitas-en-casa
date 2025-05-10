// routes/usuario.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const { verificarToken } = require('../Middlewares/authMiddleware');

// GET: Perfil del usuario actual
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const user = await Usuario.findById(req.usuario.id).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// PUT: Actualizar perfil
router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const updates = { ...req.body };

    // Si incluye contraseña, la encriptamos
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const actualizado = await Usuario.findByIdAndUpdate(req.usuario.id, updates, { new: true });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});
