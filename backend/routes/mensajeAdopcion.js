const express   = require('express');
const router    = express.Router();
const nodemailer = require('nodemailer');

// Nodo: ya deberías tener tu transporter configurado en algún lado globalmente
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { mascotaId, razones, destinoEmail } = req.body;
  if (!mascotaId || !razones || !destinoEmail) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: destinoEmail,
    subject: `Nuevo mensaje de adopción para mascota ${mascotaId}`,
    text: `Razones de adopción:\n\n${razones}\n\nID de mascota: ${mascotaId}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error enviando email:', err);
    res.status(500).send('No se pudo enviar el correo');
  }
});

module.exports = router;
