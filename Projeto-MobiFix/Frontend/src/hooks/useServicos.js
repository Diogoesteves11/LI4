import { useMutation } from '@tanstack/react-query';
import { servicoService } from '../services/servicoService';
import { useQuery } from "@tanstack/react-query";

export function useCriarServico() {
    return useMutation({
        mutationFn: (dados) => servicoService.criar(dados)
    });
}

export function useServicos(){
    return useQuery({
        queryKey: ['servicos'],
        queryFn: servicoService.listar,
        staleTime: 1,
    });
}