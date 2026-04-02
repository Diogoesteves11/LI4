const express = require('express');
const router = express.Router();
const vendaController = require('../../controllers/financeControllers/vendaController');

router.post('/', vendaController.criarVenda);
router.get('/', vendaController.listarVendas);
router.get('/:id', vendaController.obterVenda);
router.put('/:id', vendaController.atualizarVenda);
router.delete('/:id', vendaController.eliminarVenda);

module.exports = router;