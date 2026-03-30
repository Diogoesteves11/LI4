import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authservice';

export function useLoginCliente(){
    return useMutation({
        mutationFn: ({email, password}) => authService.loginCliente(email, password),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_name', data.nome);
            localStorage.setItem('user_role', 'Cliente');

            console.log('Login efetuado com sucesso!');
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Erro ao fazer login";
            alert(msg);
        }
    });
}

export function useRegistoCliente() {
    return useMutation({
        mutationFn: (data) => authService.registoCliente(
            data.nome,
            data.nif, 
            data.telefone,
            data.morada,
            data.email,
            data.password
        ),
        onSuccess: () => {
            console.log('Registo efetuado com sucesso!');
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Erro ao criar conta";
            alert(msg);
        }
    });
}