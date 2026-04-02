const Servico = require('../../models/service/Servico');
const { paraServicoDto } = require('../../dtos/serviceDtos/servicoDto');

exports.criarServico = async (req, res) => {
    try {
        const servico = new Servico({
            _id: req.body.ServicoID,
            trotineteId: req.body.TrotineteNumSerie,
            estado: req.body.Estado,
            descricaoDiagnostico: req.body.DescricaoDiagnostico,
            preco: req.body.Preco,
            dataAgendamento: new Date(),
            historicoIntervencoes: []
        });
        await servico.save();
        return res.status(201).json(paraServicoDto(servico.toObject()));
    } catch (error) { return res.status(400).json({ error: error.message }); }
};

exports.listarServicos = async (req, res) => {
    try {
        const servicos = await Servico.find().lean();
        return res.status(200).json(servicos.map(s => paraServicoDto(s)));
    } catch (error) { return res.status(500).json({ error: error.message }); }
};

exports.obterServico = async (req, res) => {
    try {
        const servico = await Servico.findById(req.params.id).lean();
        if (!servico) return res.status(404).json({ mensagem: "Não encontrado." });
        return res.status(200).json(paraServicoDto(servico));
    } catch (error) { return res.status(500).json({ error: error.message }); }
};

exports.atualizarServico = async (req, res) => {
    try {
        const atualizado = await Servico.findByIdAndUpdate(req.params.id, {
            estado: req.body.Estado,
            descricaoDiagnostico: req.body.DescricaoDiagnostico,
            preco: req.body.Preco
        }, { new: true }).lean();
        if (!atualizado) return res.status(404).json({ mensagem: "Não encontrado." });
        return res.status(200).json(paraServicoDto(atualizado));
    } catch (error) { return res.status(400).json({ error: error.message }); }
};

exports.eliminarServico = async (req, res) => {
    try {
        const removido = await Servico.findByIdAndDelete(req.params.id);
        if (!removido) return res.status(404).json({ mensagem: "Não encontrado." });
        return res.status(204).send();
    } catch (error) { return res.status(500).json({ error: error.message }); }
};