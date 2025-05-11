const express = require('express');
const router = express.Router();
const { verificarToken } = require('../Middlewares/authMiddleware'); // Import specific middleware
const ctrl = require('../controllers/alarmaController');

// Apply the middleware to all routes in this router
router.use(verificarToken);

router.post('/', ctrl.crearAlarma);
router.get('/', ctrl.obtenerAlarmas);
router.put('/:id', ctrl.actualizarAlarma);
router.delete('/:id', ctrl.eliminarAlarma);

module.exports = router;