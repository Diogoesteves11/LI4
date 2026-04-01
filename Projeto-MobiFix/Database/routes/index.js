const express = require('express');
const router = express.Router();

// [CENÁRIO DE TESTES] - Autenticação comentada
// const verificarToken = require('../middlewares/authMiddleware');

const funcionarioController = require('../controllers/funcionarioController');
// const clienteController = require('../controllers/clienteController'); // Se o cliente também fizer login via LN

// Importação das Rotas
const funcionarioRoutes = require('./funcionarioRoutes');
const clienteRoutes = require('./clienteRoutes');
const trotineteRoutes = require('./trotineteRoutes');
const pecaRoutes = require('./pecaRoutes');
const intervencaoCatalogoRoutes = require('./intervencaoCatalogoRoutes');
const servicoRoutes = require('./servicoRoutes');
const agendaRoutes = require('./agendaRoutes');
const vendaRoutes = require('./vendaRoutes');
const faturaRoutes = require('./faturaRoutes');
const encomendaClienteRoutes = require('./encomendaClienteRoutes');
const encomendaStockRoutes = require('./encomendaStockRoutes');
const promocaoRoutes = require('./promocaoRoutes');

// ==========================================
// 1. ROTAS DE SISTEMA (Públicas / Sem JWT)
// ==========================================
// Estas rotas são usadas exclusivamente pela LN (C#) para o processo de Login.
// Elas devolvem o objeto completo (com hash) para que a LN valide a password.
router.get('/auth/funcionario/:numero', funcionarioController.obterPorNumeroLogin);
// router.get('/auth/cliente/:email', clienteController.obterPorEmailSistema); 

// ==========================================
// 2. MIDDLEWARE GLOBAL DE AUTENTICAÇÃO
// ==========================================
// Quando descomentares a linha abaixo, as rotas de sistema acima CONTINUAM públicas,
// mas tudo o que estiver abaixo fica trancado.
// router.use(verificarToken);

// ==========================================
// 3. MAPEAMENTO DE ROTAS DE DADOS (CRUD)
// ==========================================
router.use('/funcionarios', funcionarioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/trotinetes', trotineteRoutes);
router.use('/pecas', pecaRoutes);
router.use('/intervencoes-catalogo', intervencaoCatalogoRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agenda', agendaRoutes);
router.use('/vendas', vendaRoutes);
router.use('/faturas', faturaRoutes);
router.use('/encomendas-cliente', encomendaClienteRoutes);
router.use('/encomendas-stock', encomendaStockRoutes);
router.use('/promocoes', promocaoRoutes);

module.exports = router;