// controllers/mascotasController.js

const Mascota     = require('../models/mascota');
const Alarma      = require('../models/alarma');
const Usuario     = require('../models/usuario');
const transporter = require('../config/nodemailer');

exports.crearMascota = async (req, res, next) => {
  try {
    // 1) Extraemos y guardamos la nueva mascota
    const {
      nombre, tipo, raza, edad, sexo,
      color, vacunado, esterilizado,
      imagen, observaciones,
      estado, locacion, fecha
    } = req.body;

    const mascota = new Mascota({
      user:         req.usuario.id,
      nombre, tipo, raza, edad, sexo,
      color, vacunado, esterilizado,
      imagen, observaciones,
      estado, locacion, fecha
    });

    console.log('>> Mascota creada, notificando alarmas…');
    notificarAlarmas(mascota)
    .then(() => console.log('>> notificarAlarmas terminó'))
    .catch(err => console.error('Error notificando alarmas:', err));

    await mascota.save();

    

    // 2) Construimos el filtro sencillo: tipo, sexo y edad ≤ edadMax
    const filtros = {
      tipo:    mascota.tipo,
      sexo:    mascota.sexo,
      edadMax: { $gte: Number(mascota.edad) }
    };

    // 3) Buscamos las alarmas que coincidan
    const alarmas = await Alarma.find(filtros);

    // 4) Enviamos un correo a cada usuario con alarma
    for (let alarma of alarmas) {
      const user = await Usuario.findById(alarma.user);
      if (!user || !user.email) continue;

      await transporter.sendMail({
        from:    process.env.EMAIL_FROM,
        to:      user.email,
        subject: `🐾 Nueva mascota de tipo ${mascota.tipo}`,
        html: `
          <p>Hola ${user.username || user.email},</p>
          <p>Se ha agregado una mascota que coincide con tu alarma:</p>
          <ul>
            <li><strong>Nombre:</strong> ${mascota.nombre}</li>
            <li><strong>Tipo:</strong> ${mascota.tipo}</li>
            <li><strong>Sexo:</strong> ${mascota.sexo}</li>
            <li><strong>Edad:</strong> ${mascota.edad} años</li>
          </ul>
          <p><a href="${process.env.FRONTEND_URL}/mascotas/${mascota._id}">Ver detalles</a></p>
          <small>Para dejar de recibir estas notificaciones, elimina tu alarma en la plataforma.</small>
        `
      });
    }

    // 5) Respondemos al cliente
    res.status(201).json(mascota);
  } catch (err) {
    next(err);
  }
};

exports.obtenerMascotas = async (req, res, next) => {
  try {
    const mascotas = await Mascota.find();
    res.json(mascotas);
  } catch (err) {
    next(err);
  }
};

exports.obtenerMascota = async (req, res, next) => {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

exports.actualizarMascota = async (req, res, next) => {
  try {
    const mascota = await Mascota.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!mascota) return res.status(404).json({ msg: 'Mascota no encontrada' });
    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

exports.eliminarMascota = async (req, res, next) => {
  try {
    await Mascota.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
