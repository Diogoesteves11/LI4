namespace MobiFix.API.Repositories;

using MobiFix.API.Models.Stocks;

public interface iGestaoStocks {
    Task<bool> CriarEncomendaAsync(EncomendaStock encomenda);
    Task<bool> AtualizarEstadoEncomendaAsync(string idEncomenda, string estado, string idRececao, DateTime dataRececao);
    Task<EncomendaStock?> ObterPorIdAsync(string idEncomenda);

    Task<bool> CriarPromocaoAsync(Promocao promocao);
    Task<bool> DesativarPromocaoAsync(string idPromocao);
    Task<Promocao?> ObterPromocaoAtivaAsync(string idPromocao);

    Task<bool> CriarReservaAsync(ReservasCliente reserva);
    Task<bool> AtualizarStatusReservaAsync(string idReserva, string novoStatus);
    Task<ReservasCliente?> ObterReservaAsync(string idReserva);
} 
