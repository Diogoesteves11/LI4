const express = require('express');
const router = express.Router();
const clienteController = require('../../controllers/userControllers/clienteController');


router.get('/', clienteController.listarClientes);

router.get('/:nif', clienteController.obterPorNif);


router.post('/', clienteController.criarCliente);

router.put('/:nif', clienteController.atualizarCliente);

router.delete('/:nif', clienteController.eliminarCliente);

module.exports = router;