const Promocao = require('../../models/finance/Promocao');
const { paraPromocaoDto } = require('../../dtos/financeDtos/promocaoDto');

exports.criarPromocao = async (req, res) => {
    try {
        const novaPromocao = new Promocao({
            _id: req.body.PromocaoID,
            descricao: req.body.Descricao,
            percentagemDesconto: req.body.PercentagemDesconto,
            dataInicio: req.body.DataInicio,
            dataFim: req.body.DataFim,
            administradorNumero: req.body.AdministradorNumero,
            pecasAplicaveisEANs: req.body.PecasAplicaveisEANs
        });
        await novaPromocao.save();
        return res.status(201).json(paraPromocaoDto(novaPromocao.toObject()));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.listarPromocoes = async (req, res) => {
    try {
        const { ativa, pecaEan } = req.query;
        let filtro = {};
        if (ativa === 'true') {
            const agora = new Date();
            filtro.dataInicio = { $lte: agora };
            filtro.dataFim = { $gte: agora };
        } else if (ativa === 'false') {
            filtro.dataFim = { $lt: new Date() };
        }
        if (pecaEan) filtro.pecasAplicaveisEANs = pecaEan;
        const promocoes = await Promocao.find(filtro)
            .sort({ dataFim: -1 })
            .lean();
        return res.status(200).json(promocoes.map(p => paraPromocaoDto(p)));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.obterPromocao = async (req, res) => {
    try {
        const promocao = await Promocao.findById(req.params.id).lean();
        if (!promocao) return res.status(404).json({ mensagem: "Promoção não encontrada." });
        return res.status(200).json(paraPromocaoDto(promocao));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.atualizarPromocao = async (req, res) => {
    try {
        const dadosAtualizados = {
            descricao: req.body.Descricao,
            percentagemDesconto: req.body.PercentagemDesconto,
            dataFim: req.body.DataFim
        };

        const promocao = await Promocao.findByIdAndUpdate(req.params.id, dadosAtualizados, { new: true }).lean();
        if (!promocao) return res.status(404).json({ mensagem: "Não encontrada." });
        return res.status(200).json(paraPromocaoDto(promocao));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.eliminarPromocao = async (req, res) => {
    try {
        const resultado = await Promocao.findByIdAndDelete(req.params.id);
        if (!resultado) return res.status(404).json({ mensagem: "Não encontrada." });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};