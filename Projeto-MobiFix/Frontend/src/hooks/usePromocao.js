import { useQuery } from "@tanstack/react-query";
import { promocaoService } from "../services/promocaoService";

export function usePromocoes() {
    return useQuery({
        queryKey:['promocoes'],
        queryFn: promocaoService.getPromocoes,
        staleTime: 1000 * 60 * 5,
    });
}