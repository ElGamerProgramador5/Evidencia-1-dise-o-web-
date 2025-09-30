const express = require('express');
const router = express.Router();
const { getAllMedicamentos } = require('../controllers/medicamentosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /medicamentos - Obtiene la lista de todos los medicamentos
router.get('/', authenticateToken, getAllMedicamentos);

module.exports = router;