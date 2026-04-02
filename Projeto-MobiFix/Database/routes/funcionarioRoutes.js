const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/funcionarioController');

router.get('/', ctrl.listarFuncionarios);
router.post('/', ctrl.criarFuncionario);
router.put('/:numero', ctrl.atualizarFuncionario);
router.get('/:numero', ctrl.fetchFuncionario);
router.delete('/:numero', ctrl.eliminarFuncionario);

module.exports = router;
