namespace Backend.Services;

using Backend.Models;

public interface IEncomendaClienteService
{
    Task<EncomendaClienteDto?> CriarEncomendaAsync(string clienteNIF, EncomendaClienteCriacaoDto dto);
    Task<IEnumerable<EncomendaClienteDto>> ListarEncomendasClienteAsync(string clienteNIF);
}