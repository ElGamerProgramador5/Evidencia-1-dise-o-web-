const express = require('express');
const router = express.Router();
const { crearReceta, imprimirReceta } = require('../controllers/recetasController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', crearReceta);
router.get('/:id/print', imprimirReceta);

module.exports = router;
