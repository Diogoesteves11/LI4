import { useMutation } from '@tanstack/react-query';
import { agendaService } from '../services/agendaService';

export function useCriarAgenda() {
    return useMutation({
        mutationFn: (dados) => agendaService.criarSlot(dados)
    });
}