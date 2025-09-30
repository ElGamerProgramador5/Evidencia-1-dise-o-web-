const express = require('express');
const router = express.Router();
const { crearPaciente, listarPacientes } = require('../controllers/pacientesController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', crearPaciente);
router.get('/', listarPacientes);

module.exports = router;
