import { useQuery } from "@tanstack/react-query";
import { faturaService } from "../services/faturaService";

export function useFaturas(clienteId){
    return useQuery({
        queryKey: ['faturas', clienteId],
        queryFn: () => faturaService.getFaturaDeCliente(clienteId),
        enabled: !!clienteId,
        staleTime: 1000 * 60 * 5,
    });
}