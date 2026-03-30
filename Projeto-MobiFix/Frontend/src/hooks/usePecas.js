import { useQuery } from "@tanstack/react-query";
import { pecaService } from "../services/pecaService";

export function usePecas(){
    return useQuery({
        queryKey: ['pecas'],
        queryFn: pecaService.getPecas,
        staleTime: 1000 * 60 * 5,
    });
}