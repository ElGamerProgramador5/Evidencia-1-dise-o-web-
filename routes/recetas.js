const express = require('express');
const router = express.Router();
const { createReceta, getRecetaForPrint } = require('../controllers/recetasController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', createReceta);
router.get('/:id/print', getRecetaForPrint);

module.exports = router;
