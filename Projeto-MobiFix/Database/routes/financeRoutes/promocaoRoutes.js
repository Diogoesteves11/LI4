const express = require('express');
const router = express.Router();
const promocaoController = require('../../controllers/financeControllers/promocaoController');

router.post('/', promocaoController.criarPromocao);
router.get('/', promocaoController.listarPromocoes);
router.get('/:id', promocaoController.obterPromocao);
router.put('/:id', promocaoController.atualizarPromocao);
router.patch('/:id/estado', promocaoController.alterarEstadoPromocao);
router.delete('/:id', promocaoController.eliminarPromocao);

module.exports = router;