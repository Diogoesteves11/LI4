const express = require('express');
const router = express.Router();
const agendaController = require('../../controllers/serviceControllers/agendaController');

router.post('/', agendaController.criarSlot);
router.get('/', agendaController.listarAgenda);
router.get('/:id', agendaController.obterSlot);
router.put('/:id', agendaController.atualizarSlot);
router.delete('/:id', agendaController.eliminarSlot);

module.exports = router;