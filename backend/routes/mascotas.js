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

    const mascotas = await Mascota.find(filtros)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Mascota.countDocuments(filtros);

    res.json({ total, page: Number(page), data: mascotas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});
/*
router.get('/', async (req, res) => {
  try {
    const {
      tipo,
      raza,
      sexo,
      edad,
      color,
      vacunado,
      esterilizado,
      estado,
      locacion,
      page = 1,
      limit = 4
    } = req.query;


    const filtros = {};

    const camposTexto = { 
      tipo, 
      raza, 
      sexo, 
      color, 
      estado, 
      locacion, 
      vacunado, 
      esterilizado 
    };
    
    for (const [campo, valor] of Object.entries(camposTexto)) {
      if (valor && valor.trim()) {
        // Para vacunado y esterilizado, usamos coincidencia exacta pero insensible a mayúsculas
        if (campo === 'vacunado' || campo === 'esterilizado') {
          // Usamos expresión regular que sea exacta pero insensible a mayúsculas
          filtros[campo] = new RegExp(`^${valor.trim()}$`, 'i');
        } else {
          // Para los demás campos, usamos coincidencia parcial
          filtros[campo] = new RegExp(valor.trim(), 'i');
        }
      }
    }

    // Manejo especial para edad si es necesario
    if (edad && edad.trim()) {
      if (edad.includes('-')) {
        const [min, max] = edad.split('-').map(v => v.trim());
        filtros.edad = { $gte: min, $lte: max };
      } else {
        filtros.edad = edad.trim();
      }
    }

    console.log("Filtros aplicados:", filtros);

    const mascotas = await Mascota.find(filtros)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Mascota.countDocuments(filtros);

    res.json({ total, page: Number(page), data: mascotas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener mascotas', details: err.message });
  }
});*/

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

module.exports = router;
