const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host:     process.env.EMAIL_HOST,
  port:     +process.env.EMAIL_PORT,
  secure:   process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar conexión (solo una vez al iniciar)
transporter.verify()
  .then(() => console.log('✔️  SMTP listo para enviar correos'))
  .catch(err => console.error('❌  Error con SMTP:', err));

module.exports = transporter;
