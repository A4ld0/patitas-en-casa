const Adopcion = require('../models/adopcion');

exports.crearAdopcion = async (req, res) => {
  try {
    const { mascotaId, nombre, motivo, email } = req.body;

    const nuevaAdopcion = new Adopcion({
      mascota: mascotaId,
      usuario: req.usuario.id, // este ID viene del token
      nombre,
      motivo,
      email
    });

    const guardada = await nuevaAdopcion.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('Error al crear adopción:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
