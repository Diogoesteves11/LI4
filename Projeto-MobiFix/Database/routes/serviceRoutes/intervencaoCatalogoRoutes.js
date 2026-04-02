const express = require('express');
const router = express.Router();
const controller = require('../../controllers/serviceControllers/intervencaoCatalogoController');

router.post('/', controller.criarIntervencao);
router.get('/', controller.listarIntervencoes);
router.get('/:id', controller.obterPorId);
router.put('/:id', controller.atualizarIntervencao);
router.delete('/:id', controller.eliminarIntervencao);
module.exports = router;