import { useMutation } from '@tanstack/react-query';
import { servicoService } from '../services/servicoService';

export function useCriarServico() {
    return useMutation({
        mutationFn: (dados) => servicoService.criar(dados)
    });
}