import api from './api';

export const servicoService = {
    criar: async (dados) => {
        const response = await api.post('/Servicos', {
            TrotineteNumSerie: dados.trotineteNumSerie,
            FeedbackCliente: dados.descricao,
        });
        return response.data;
    }
};