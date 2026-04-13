import api from './api';

export const statsService = {
    getEstatisticasGlobais: async () => {
        const response = await api.get('/Estatisticas');
        return response.data;
    },

    getEstatisticasDia: async (dia) => {
        const iso = dia instanceof Date ? dia.toISOString() : dia;
        const response = await api.get('/Estatisticas/dia', { params: { dia: iso } });
        return response.data;
    },

    getEstatisticasIntervalo: async (inicio, fim) => {
        const inicioIso = inicio instanceof Date ? inicio.toISOString() : inicio;
        const fimIso = fim instanceof Date ? fim.toISOString() : fim;
        const response = await api.get('/Estatisticas/intervalo', {
            params: { inicio: inicioIso, fim: fimIso }
        });
        return response.data;
    }
};
