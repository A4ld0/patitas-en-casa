const express = require('express');
const Mascota = require('../models/mascota');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../Middlewares/authMiddleware');


// GET: Todas con filtros y paginación antes de modificar

router.get('/', async (req, res) => {
  try {
    const { tipo, raza, sexo, page = 1, limit = 4 } = req.query;

    const filtros = {};
    if (tipo) filtros.tipo = tipo;
    if (raza) filtros.raza = raza;
    if (sexo) filtros.sexo = sexo;

    if (req.query.nombre) {
      filtros.nombre = new RegExp(req.query.nombre, 'i'); // búsqueda insensible a mayúsculas
    }


    const mascotas = await Mascota.find(filtros)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Mascota.countDocuments(filtros);

    res.json({ total, page: Number(page), data: mascotas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});

// GET: Mascota por ID
router.get('/:id', async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ error: 'No encontrada' });
    res.json(mascota);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar la mascota' });
  }
});

// POST: Crear mascota
router.post('/', async (req, res) => {
  try {
    const nuevaMascota = new Mascota(req.body);
    await nuevaMascota.save();
    res.status(201).json(nuevaMascota);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear mascota' });
  }
});

// PUT: Actualizar
router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const actualizada = await Mascota.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) return res.status(404).json({ error: 'No encontrada' });
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// DELETE: Eliminar
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const eliminada = await Mascota.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'No encontrada' });
    res.json({ message: 'Mascota eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

router.get('/', async (req, res, next) => {
  try {
    // Sólo copiar las propiedades que esperamos
    const allowed = [
      'tipo','edad','sexo',
      'vacunado','esterilizado','estado'
    ];
    const filtros = {};
    allowed.forEach(key => {
      if (req.query[key]) filtros[key] = req.query[key];
    });

    const resultados = await Mascota.find(filtros);
    res.json(resultados);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
