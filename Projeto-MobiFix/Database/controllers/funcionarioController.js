const Funcionario = require('../models/Funcionario');

exports.obterPorNumeroLogin = async (req, res) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ error: "Acesso Negado. Chave de sistema inválida." });
    }

    

};


