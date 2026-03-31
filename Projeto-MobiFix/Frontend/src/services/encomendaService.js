import api from "./api";

export const encomendaService = {
    getEncomendasStock: async () => {
        const response = await api.get('/Encomendas/stock');
        return response.data;
    }
}