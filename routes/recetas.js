const express = require('express');
const router = express.Router();
const { crearReceta, imprimirReceta } = require('../controllers/recetasController');

router.post('/', crearReceta);
router.get('/:id/print', imprimirReceta);

module.exports = router;
