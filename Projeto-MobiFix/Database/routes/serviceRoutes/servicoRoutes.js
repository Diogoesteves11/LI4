const express = require('express');
const router = express.Router();
const controller = require('../../controllers/serviceControllers/servicoController');

router.post('/', controller.criarServico);
router.get('/', controller.listarServicos);
router.get('/:id', controller.obterServico);
router.put('/:id', controller.atualizarServico);
router.delete('/:id', controller.eliminarServico);
module.exports = router;