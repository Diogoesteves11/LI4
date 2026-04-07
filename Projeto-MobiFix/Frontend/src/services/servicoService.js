import api from './api';

export const servicoService = {
    criar: async (dados) => {
        // Envia para o controller .NET: api/Servicos
        const response = await api.post('/Servicos', {
            ServicoID: crypto.randomUUID(), // Geramos um ID temporário/único
            TrotineteNumSerie: dados.trotineteNumSerie,
            Estado: "Pendente",
            DescricaoDiagnostico: dados.descricao,
            Preco: 0 // Diagnóstico é gratuito
        });
        return response.data;
    }
};