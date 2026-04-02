const express = require('express');
const router = express.Router();
const encomendaStockController = require('../../controllers/stockControllers/encomendaStockController');

router.post('/', encomendaStockController.criarEncomenda);
router.get('/', encomendaStockController.listarEncomendas);
router.get('/:id', encomendaStockController.obterEncomenda);
router.put('/:id', encomendaStockController.atualizarEncomenda);
router.delete('/:id', encomendaStockController.eliminarEncomenda);

module.exports = router;