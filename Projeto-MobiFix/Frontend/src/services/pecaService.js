import api from "./api";

export const pecaService = {
    getPecas: async () => {
        const response = await api.get('/pecas');
        return response.data;
    },

    obterPeca: async (ean) => {
        const response = await api.get(`/pecas/${ean}`);
        return response.data;
    },

    criarPeca: async (dados) => {
        const response = await api.post('/pecas', dados);
        return response.data;
    },

    atualizarPeca: async (ean, dados) => {
        const response = await api.put(`/pecas/${ean}`, dados);
        return response.data;
    },

    alterarEstadoPeca: async (ean, ativo) => {
        const response = await api.patch(`/pecas/${ean}/estado`, { Ativo: ativo });
        return response.data;
    },
};