const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        email,
        telefono,
        password,
        username,
        estado,
        municipio,
        codigoPostal,
        fechaNacimiento
      } = req.body;
  
      const existente = await Usuario.findOne({ email });
      if (existente) return res.status(400).json({ error: 'El correo ya está registrado' });
  
      const existenteUser = await Usuario.findOne({ username });
      if (existenteUser) return res.status(400).json({ error: 'El username ya está en uso' });
  
      const hash = await bcrypt.hash(password, 10);
      const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        email,
        telefono,
        password: hash,
        username,
        estado,
        municipio,
        codigoPostal,
        fechaNacimiento
      });
  
      await nuevoUsuario.save();
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
  

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ error: 'Credenciales inválidas' });

    const validado = await bcrypt.compare(password, usuario.password);
    if (!validado) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
