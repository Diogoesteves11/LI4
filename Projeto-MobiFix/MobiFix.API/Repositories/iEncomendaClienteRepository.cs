using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IEncomendaClienteRepository
{
    Task<EncomendaClienteDto?> CriarAsync(EncomendaClienteDto dto);
    Task<bool> AdicionarItemAsync(EncomendaClienteItemDto dto);
    Task<List<EncomendaClienteDto>> ObterPorClienteAsync(int clienteId);
    Task<EncomendaClienteDto?> ObterPorIdAsync(int id);
    Task<bool> AtualizarEstadoAsync(int id, string estado);
    Task<bool> AtualizarFaturaAsync(int encomendaId, int faturaId);
}
