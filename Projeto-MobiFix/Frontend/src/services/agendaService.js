import api from "./api";

export const agendaService = {
    getAgendaMecanico: async(mecanicoId) => {
        const response = await api.get(`/Agenda/mecanico/${mecanicoId}`);
        return response.data;
    },

    createAgenda: async(agenda) => {
        const response = await api.post('/Agenda', {agenda});
        return response.data;
    }
}