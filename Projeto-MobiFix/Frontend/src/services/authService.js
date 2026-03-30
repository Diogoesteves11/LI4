import api from './api';

export const authService = {
    loginCliente: async(email, password) => {
        const response = await api.post('/Auth/login/cliente', { email, password });
        return response.data;
    },

    loginFuncionario: async(numeroMecanografico, password) => {
        const response = await api.post('/Auth/login/cliente', {
            numeroMecanografico, password 
            });
        return response.data;
    }
}