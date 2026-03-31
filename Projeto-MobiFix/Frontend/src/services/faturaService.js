import api from './api';

export const faturaService = {
    getFaturaDeCliente: async(clienteId) => {
        const response = await api.get(`/Faturas/cliente/${clienteId}`);
        return response.data;
    }
}