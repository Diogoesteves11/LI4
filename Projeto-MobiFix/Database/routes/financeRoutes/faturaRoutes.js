const express = require('express');
const router = express.Router();
const faturaController = require('../../controllers/financeControllers/faturaController');

router.post('/', faturaController.criarFatura);
router.get('/', faturaController.listarFaturas);
router.get('/:numero', faturaController.obterFatura);
router.put('/:numero', faturaController.atualizarFatura);
router.delete('/:numero', faturaController.eliminarFatura);

module.exports = router;