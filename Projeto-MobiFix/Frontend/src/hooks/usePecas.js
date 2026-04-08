import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pecaService } from "../services/pecaService";

// Hook de Leitura
export function usePecas() {
    return useQuery({
        queryKey: ['pecas'],
        queryFn: pecaService.getPecas,
        staleTime: 1,
    });
}

// Hook para Criar
export function useCriarPeca() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: pecaService.criarPeca,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pecas'] });
        },
    });
}

// Hook para Atualizar (Edição Completa)
export function useAtualizarPeca() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ean, dados }) => pecaService.atualizarPeca(ean, dados),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pecas'] });
        },
    });
}

// Hook para Ativar/Desativar (Edição Parcial)
export function useAlterarEstadoPeca() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ean, ativo }) => pecaService.alterarEstadoPeca(ean, ativo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pecas'] });
        },
    });
}
