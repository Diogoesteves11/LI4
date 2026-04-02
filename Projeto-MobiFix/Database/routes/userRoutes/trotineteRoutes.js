const express = require('express');
const router = express.Router();
const controller = require('../../controllers/userControllers/trotineteController')

router.get('/', controller.listarTrotinetes);
router.get('/:numSerie', controller.obterPorNumSerie);
router.put('/:numSerie', controller.atualizarTrotinete);
router.post('/', controller.criarTrotinete);
router.delete('/:numSerie', controller.eliminarTrotinete)

module.exports = router;