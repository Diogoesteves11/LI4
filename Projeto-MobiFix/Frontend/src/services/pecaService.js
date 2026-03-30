import api from "./api";

export const pecaService = {
    getPecas: async() => {
        const response = await api.get('/Pecas');
        return response.data;
    }
}
