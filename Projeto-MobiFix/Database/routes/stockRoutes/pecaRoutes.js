const express = require('express');
const router = express.Router();
const controller = require('../../controllers/stockControllers/pecaController')

router.get('/', controller.listarPecas);
router.get('/:ean', controller.obterPorEan);
router.put('/:ean', controller.atualizarPeca);
router.post('/', controller.criarPeca);
router.delete('/:ean', controller.eliminarPeca);

module.exports = router;