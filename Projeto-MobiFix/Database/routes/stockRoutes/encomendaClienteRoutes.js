const express = require('express');
const router = express.Router();
const encomendaClienteController = require('../../controllers/stockControllers/encomendaClienteController');

router.post('/', encomendaClienteController.criarEncomendaCliente);
router.get('/', encomendaClienteController.listarEncomendasCliente);
router.get('/:id', encomendaClienteController.obterEncomendaCliente);
router.put('/:id', encomendaClienteController.atualizarEncomendaCliente);
router.delete('/:id', encomendaClienteController.eliminarEncomendaCliente);

module.exports = router;