namespace Backend.Services;

using Backend.Models;

public interface IServicoService
{
    Task<IEnumerable<ServicoDto>> ListarTodosAsync();
    Task<ServicoDto?> ObterPorIdAsync(string id);
    Task<ServicoDto?> CriarServicoDiagnosticoAsync(ServicoCriacaoDto dto);
    Task<bool> AtualizarEstadoAsync(string id, string novoEstado);
}