const express = require('express');
const router = express.Router();

const funcionarioController = require('../controllers/funcionarioController');

// Importação das Rotas (Apenas as que já existem)
const funcionarioRoutes = require('./funcionarioRoutes');
// const clienteRoutes = require('./clienteRoutes');
// const trotineteRoutes = require('./trotineteRoutes');
// const pecaRoutes = require('./pecaRoutes');
// ... comenta as outras todas para já

// ==========================================
// 1. ROTAS DE SISTEMA (Públicas / Sem JWT)
// ==========================================
router.get('/auth/funcionario/:numero', funcionarioController.obterPorNumeroLogin);

// ==========================================
// 2. MIDDLEWARE GLOBAL DE AUTENTICAÇÃO (Para o futuro)
// ==========================================
// router.use(verificarToken);

// ==========================================
// 3. MAPEAMENTO DE ROTAS DE DADOS (CRUD)
// ==========================================
router.use('/funcionarios', funcionarioRoutes);

// Comenta tudo o que ainda não tem código no respetivo ficheiro!
// router.use('/clientes', clienteRoutes);
// router.use('/trotinetes', trotineteRoutes);
// router.use('/pecas', pecaRoutes);
// router.use('/intervencoes-catalogo', intervencaoCatalogoRoutes);
// router.use('/servicos', servicoRoutes);
// router.use('/agenda', agendaRoutes);
// router.use('/vendas', vendaRoutes);
// router.use('/faturas', faturaRoutes);
// router.use('/encomendas-cliente', encomendaClienteRoutes);
// router.use('/encomendas-stock', encomendaStockRoutes);
// router.use('/promocoes', promocaoRoutes);

module.exports = router;