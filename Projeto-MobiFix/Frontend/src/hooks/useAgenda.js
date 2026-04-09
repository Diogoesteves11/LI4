import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendaService } from '../services/agendaService';

const QUERY_KEY = ['agendas'];

export function useAgendas() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => agendaService.getAgendas(),
    });
}

export function useCriarAgenda() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dados) => agendaService.criarSlot(dados),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (error) => {
            const msg = error.response?.data?.mensagem || 'Erro ao criar agendamento.';
            alert(msg);
        },
    });
}