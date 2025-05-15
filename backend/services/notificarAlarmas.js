const Alarma     = require('../models/alarma');
const Usuario   = require('../models/usuario');   // ajusta al nombre real
const transporter = require('../config/nodemailer');

module.exports = async function notificarAlarmas(mascota) {
  // 1) Armamos filtros dinámicos según las propiedades de la mascota
  const filtros = {};
  if (mascota.especie) filtros.especie = mascota.especie;
  if (mascota.raza)    filtros.raza    = mascota.raza;
  if (mascota.color)   filtros.color   = mascota.color;
  if (mascota.ciudad)  filtros.ciudad  = mascota.ciudad;
  if (mascota.sexo)    filtros.sexo    = mascota.sexo;
  // Para edad: avisar sólo si la alarma pide edadMax ≥ edad de la mascota
  if (typeof mascota.edad === 'number') {
    filtros.edadMax = { $gte: mascota.edad };
  }

  // 2) Buscamos alarmas que coincidan
  const alarmas = await Alarma.find(filtros);

  // 3) Para cada alarma, enviamos correo al usuario
  for (let alarma of alarmas) {
    const usuario = await Usuario.findById(alarma.user);
    if (!usuario || !usuario.email) continue;

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      usuario.email,
      subject: '🐶 ¡Se encontró una mascota que coincide con tu alarma!',
      html: `
        <p>Hola ${usuario.username || usuario.email},</p>
        <p>Se acaba de publicar esta mascota que cumple tus criterios:</p>
        <ul>
          <li><strong>Nombre:</strong> ${mascota.nombre}</li>
          <li><strong>Especie:</strong> ${mascota.especie}</li>
          <li><strong>Raza:</strong> ${mascota.raza}</li>
          <li><strong>Color:</strong> ${mascota.color}</li>
          <li><strong>Sexo:</strong> ${mascota.sexo}</li>
          <li><strong>Edad:</strong> ${mascota.edad} años</li>
          <li><strong>Ubicación:</strong> ${mascota.ciudad}</li>
        </ul>
        <p><a href="https://tu-dominio.com/mascotas/${mascota._id}">Ver detalles</a></p>
        <hr/>
        <small>Si ya no deseas recibir estas notificaciones, elimina o edita tu alarma en la app.</small>
      `
    });
  }
};