import api from './api';

export const authService = {
    loginCliente: async(email, password) => {
        const response = await api.post('/Auth/login/cliente', { email, password });
        return response.data;
    },

    loginFuncionario: async(numeroMecanografico, password) => {
        const response = await api.post('/Auth/login/funcionario', {
            numeroMecanografico, password 
        });
        return response.data;
    },

    registoCliente: async(nome, nif, telefone, morada, email, password) => {
        const response = await api.post('/Auth/registar/cliente', {
            nome, nif, telefone, morada, email, password
        });
        return response.data;
    }
}