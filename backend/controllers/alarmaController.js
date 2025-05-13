const Alarma = require('../models/alarma');

// Crear una nueva alarma
exports.crearAlarma = async (req, res, next) => {
  try {
    const data = { user: req.usuario.id, ...req.body };
    const alarma = new Alarma(data);
    await alarma.save();
    res.status(201).json(alarma);
  } catch (err) {
    next(err);
  }
};

// Listar todas las alarmas del usuario
exports.obtenerAlarmas = async (req, res, next) => {
  try {
    const alarmas = await Alarma.find({ user: req.usuario.id });
    res.json(alarmas);
  } catch (err) {
    next(err);
  }
};

// Actualizar una alarma
exports.actualizarAlarma = async (req, res, next) => {
  try {
    const alarma = await Alarma.findOneAndUpdate(
      { _id: req.params.id, user: req.usuario.id },
      req.body,
      { new: true }
    );
    res.json(alarma);
  } catch (err) {
    next(err);
  }
};

// Eliminar una alarma
exports.eliminarAlarma = async (req, res, next) => {
  try {
    await Alarma.deleteOne({ _id: req.params.id, user: req.usuario.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};