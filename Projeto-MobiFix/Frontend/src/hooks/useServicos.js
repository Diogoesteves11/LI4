import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicoService } from '../services/servicoService';

const QUERY_KEY = ['servicos'];

export function useServicos() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => servicoService.listar(),
    });
}

export function useCriarServico() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dados) => servicoService.criar(dados),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            const msg = error.response?.data?.mensagem || 'Erro ao criar serviço.';
            alert(msg);
        },
    });
}