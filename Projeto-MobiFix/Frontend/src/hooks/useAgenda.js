import { agendaService } from '../services/agendaService';
import { useMutation, useQuery} from '@tanstack/react-query';

export function useCriarAgenda() {
    return useMutation({
        mutationFn: (dados) => agendaService.criarSlot(dados)
    });
}

export function useAgendas(){
    return useQuery({
        queryKey: ['agendas'],
        queryFn: agendaService.getAgendas,
        staleTime: 1000 * 60,
    });
}