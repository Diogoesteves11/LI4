const Servico = require('../models/Servico');
const { paraServicoDto } = require('../dtos/servicoDto');

exports.listarServicos = async (req, res) => {
    try {
        const { estado, trotineteId } = req.query;
        let filtro = {};
        if (estado) filtro.estado = estado;
        if (trotineteId) filtro.trotineteId = trotineteId;
        const servicos = await Servico.find(filtro).lean();
        return res.status(200).json(servicos.map(paraServicoDto));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.obterPorId = async (req, res) => {
    try {
        const servico = await Servico.findById(parseInt(req.params.servicoId)).lean();
        if (!servico) return res.status(404).json({ mensagem: "Não encontrado." });
        return res.status(200).json(paraServicoDto(servico));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.criarServico = async (req, res) => {
    try {
        const ultimo = await Servico.findOne().sort({ _id: -1 }).lean();
        const novoId = (ultimo?._id || 0) + 1;

        const novo = new Servico({
            _id: novoId,
            trotineteId: req.body.TrotineteNumSerie,
            estado: req.body.Estado || 'AGENDADO',
            dataAgendamento: req.body.DataAgendamento || new Date(),
            feedbackCliente: req.body.FeedbackCliente,
            preco: req.body.Preco || 0
        });
        await novo.save();
        return res.status(201).json(paraServicoDto(novo));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.atualizarServico = async (req, res) => {
    try {
        const dados = {};
        if (req.body.Estado) dados.estado = req.body.Estado;
        if (req.body.DescricaoDiagnostico !== undefined) dados.descricaoDiagnostico = req.body.DescricaoDiagnostico;
        if (req.body.DataConclusao !== undefined) dados.dataConclusao = req.body.DataConclusao;
        if (req.body.Preco !== undefined) dados.preco = req.body.Preco;
        if (req.body.FeedbackCliente !== undefined) dados.feedbackCliente = req.body.FeedbackCliente;

        const servico = await Servico.findByIdAndUpdate(parseInt(req.params.servicoId), dados, { new: true }).lean();
        if (!servico) return res.status(404).json({ mensagem: "Não encontrado." });
        return res.status(200).json(paraServicoDto(servico));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.adicionarIntervencao = async (req, res) => {
    try {
        const servico = await Servico.findById(parseInt(req.params.servicoId));
        if (!servico) return res.status(404).json({ mensagem: "Serviço não encontrado." });

        servico.historicoIntervencoes.push({
            intervencaoCatalogoId: req.body.IntervencaoCatalogoID,
            mecanicoId: req.body.MecanicoNumero,
            dataInicio: req.body.DataInicio || new Date(),
            dataFim: req.body.DataFim || null,
            pecasUtilizadas: []
        });
        await servico.save();
        return res.status(201).json(paraServicoDto(servico));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.adicionarPecaIntervencao = async (req, res) => {
    try {
        const servico = await Servico.findById(parseInt(req.params.servicoId));
        if (!servico) return res.status(404).json({ mensagem: "Serviço não encontrado." });

        const intervencao = servico.historicoIntervencoes.id(req.params.intervencaoIdx);
        if (!intervencao) return res.status(404).json({ mensagem: "Intervenção não encontrada." });

        intervencao.pecasUtilizadas.push({
            pecaId: req.body.PecaEAN,
            quantidade: req.body.Quantidade || 1
        });
        await servico.save();
        return res.status(201).json(paraServicoDto(servico));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.eliminarServico = async (req, res) => {
    try {
        const resultado = await Servico.findByIdAndDelete(parseInt(req.params.servicoId));
        if (!resultado) return res.status(404).json({ mensagem: "Não encontrado." });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
