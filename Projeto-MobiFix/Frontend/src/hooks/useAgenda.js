import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agendaService } from "../services/agendaService";

export function useAgendaMecanico(mecanicoId) {
    return useQuery({
        queryKey: ['agenda', mecanicoId],
        queryFn: agendaService.getAgendaMecanico,
        staleTime: 1000 * 60 * 5,
    });
}

export function useAgendaCreate(){
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (novoAgendamento) => api.post('/Agenda', novoAgendamento),
    onSuccess: () => {
      queryClient.invalidateQueries(['agenda']);
      queryClient.invalidateQueries(['repairs']); 
    }
  });
}