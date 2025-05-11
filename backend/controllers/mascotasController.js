// controllers/mascotasController.js
const Mascota     = require('../models/mascota');
const Alarma      = require('../models/alarma');
const transporter = require('../config/nodemailer');

exports.crearMascota = async (req, res, next) => {
  try {
    // 1) Creamos la mascota
    const mascota = await Mascota.create(req.body);

    // 2) Armamos filtros para buscar alarmas que coincidan
    const filtros = {
      ...(mascota.especie && { especie: mascota.especie }),
      ...(mascota.raza && { raza: mascota.raza }),
      ...(mascota.sexo && { sexo: mascota.sexo }),
      ...(mascota.edad && { edadMax: { $gte: mascota.edad } })
      // añade más campos si lo necesitas
    };

    console.log('POST /api/mascotas → filtros:', filtros);
    const alarmasCount = await Alarma.find(filtros).countDocuments();
    console.log('Alarmas encontradas:', alarmasCount);


    // Log para depuración: cuántas alarmas cumplen esos filtros
    console.log('Alarmas encontradas:', (await Alarma.find(filtros)).length);

    // 3) Encontramos todas las alarmas que cumplan esos filtros
    const alarmas = await Alarma.find(filtros).populate('user');

    for (const alarma of alarmas) {
      console.log('Enviando correo a:', alarma.user.email);
      await transporter.sendMail({ /* ... */ });
    }

    // 4) Enviamos un correo por cada alarma encontrada
    for (const alarma of alarmas) {
      const { user } = alarma;
      console.log('Enviando correo a:', user.email);
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: '🐾 ¡Nueva mascota coincide con tu alarma!',
        text:
          `Hola ${user.nombre || user.username},\n\n` +
          `Se ha subido una mascota que cumple los criterios de tu alarma:\n` +
          `  • Tipo:  ${mascota.tipo}\n` +
          `  • Raza:  ${mascota.raza}\n` +
          `  • Edad:  ${mascota.edad} años\n` +
          `  • Sexo:  ${mascota.sexo}\n\n` +
          `Visita Patitas en Casa para más detalles.\n\n` +
          `¡Saludos!\nEl equipo de Patitas en Casa`
      });
    }

    // 5) Respondemos con la mascota creada
    res.status(201).json(mascota);

  } catch (err) {
    next(err);
  }
};
