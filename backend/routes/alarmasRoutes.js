const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middlewares/authMiddleware');
const ctrl = require('../controllers/alarmaController');
const Mascota = require('../models/mascota');
const Alarma = require('../models/alarma');
const Usuario = require('../models/usuario');
const transporter = require('../config/nodemailer');

// Aplicar autenticación a todas las rutas
router.use(verificarToken);

// Rutas CRUD estándar
router.post('/',    ctrl.crearAlarma);
router.get('/',     ctrl.obtenerAlarmas);
// antes era: router.put('/',     ctrl.actualizarAlarma);
router.put('/:id',  ctrl.actualizarAlarma);
// antes era: router.delete('/',  ctrl.eliminarAlarma);
router.delete('/:id', ctrl.eliminarAlarma);

// Ruta para revisar manualmente todas las mascotas y notificar coincidencias
router.post('/check', async (req, res) => {
  try {
    console.log('🔎 Iniciando revisión manual de mascotas...');

    // Traer todas las mascotas y alarmas
    const [mascotas, alarmas] = await Promise.all([
      Mascota.find(),
      Alarma.find()
    ]);

    let enviados = 0;
    for (let alarma of alarmas) {
      for (let mascota of mascotas) {
        const cumple =
          mascota.tipo === alarma.tipo &&
          mascota.sexo === alarma.sexo &&
          Number(mascota.edad) <= alarma.edadMax;

        console.log(`Comparando Alarma ${alarma._id} vs Mascota ${mascota._id}: ` +
          `tipoMatch=${mascota.tipo === alarma.tipo}, ` +
          `sexoMatch=${mascota.sexo === alarma.sexo}, ` +
          `edadMatch=${Number(mascota.edad) <= alarma.edadMax}`
        );

        if (cumple) {
          const user = await Usuario.findById(alarma.user);
          console.log('Usuario para notificar:', user);

          if (user && user.email) {
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to:   user.email,
              subject: `🐾 Coincidencia de alarma para ${mascota.nombre}`,
              html: `
                <p>Hola ${user.username || user.email},</p>
                <p>Se ha encontrado una mascota que coincide con tu alarma:</p>
                <ul>
                  <li><strong>Nombre:</strong> ${mascota.nombre}</li>
                  <li><strong>Tipo:</strong> ${mascota.tipo}</li>
                  <li><strong>Sexo:</strong> ${mascota.sexo}</li>
                  <li><strong>Edad:</strong> ${mascota.edad} años</li>
                </ul>
                <p><a href="${process.env.FRONTEND_URL}/mascotas/${mascota._id}">Ver detalles</a></p>
              `
            });
            console.log(`✉️  Enviado a ${user.email} (Mascota ${mascota._id})`);
            enviados++;
          } else {
            console.warn(`🔕 Usuario sin email o no encontrado para alarma ${alarma._id}`);
          }
        }
      }
    }

    console.log(`✅ Revisión completada, correos enviados: ${enviados}`);
    return res.json({ msg: `Revisión finalizada, ${enviados} correos enviados.` });
  } catch (err) {
    console.error('❌ Error en /api/alarmas/check:', err);
    return res.status(500).json({ msg: 'Error interno al revisar mascotas' });
  }
});

module.exports = router;
