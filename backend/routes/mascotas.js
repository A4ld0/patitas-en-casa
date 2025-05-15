const express = require('express');
const Mascota = require('../models/mascota');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../Middlewares/authMiddleware');

// 1) LISTADO con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const { tipo, raza, sexo, page = 1, limit = 4, nombre } = req.query;
    const filtros = {};
    if (tipo) filtros.tipo = tipo;
    if (raza) filtros.raza = raza;
    if (sexo) filtros.sexo = sexo;
    if (nombre) filtros.nombre = new RegExp(nombre, 'i');

    const data = await Mascota.find(filtros)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Mascota.countDocuments(filtros);

    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});

// 2) OBTENER por ID
router.get('/:id', async (req, res) => {
  try {
    const m = await Mascota.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'No encontrada' });
    res.json(m);
  } catch {
    res.status(500).json({ error: 'Error al buscar mascota' });
  }
});

// 3) CREAR (user autenticado)
router.post('/', verificarToken, async (req, res) => {
  try {
    const nueva = new Mascota(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch {
    res.status(500).json({ error: 'Error al crear mascota' });
  }
});

// 4) ACTUALIZAR (solo admin)
router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const actualizada = await Mascota.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) return res.status(404).json({ error: 'No encontrada' });
    res.json(actualizada);
  } catch {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// 5) ELIMINAR (solo admin)
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const eliminada = await Mascota.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'No encontrada' });
    res.json({ message: 'Mascota eliminada' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;