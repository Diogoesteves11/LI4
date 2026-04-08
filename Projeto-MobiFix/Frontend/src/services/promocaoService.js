import api from "./api";

export const promocaoService = {
    getPromocoes: async() => {
        const response = await api.get('promocoes');
        return response.data;
    }
}