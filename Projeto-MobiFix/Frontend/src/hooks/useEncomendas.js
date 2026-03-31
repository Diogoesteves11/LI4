import { useQuery } from "@tanstack/react-query";
import { encomendaService } from "../services/encomendaService";

export function useEncomendaStock() {
    return useQuery({
        queryKey:['encomendas_stock'],
        queryFn: encomendaService.getEncomendasStock,
        staleTime: 1000 * 60 * 5,
    });
}