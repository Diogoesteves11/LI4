const express = require('express');
const router = express.Router();
const controller = require('../../controllers/stockControllers/pecaController')
const verificarToken = require('../../middlewares/authMiddleware')

router.get('/', controller.listarPecas);
router.get('/:ean', controller.obterPorEan);
router.put('/:ean',verificarToken, controller.atualizarPeca);
router.post('/',verificarToken, controller.criarPeca);
router.patch('/:ean/estado',verificarToken, controller.alterarEstadoPeca);

module.exports = router;