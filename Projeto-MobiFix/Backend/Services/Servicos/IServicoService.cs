namespace Backend.Services;

using Backend.Models;

public interface IServicoService
{
    Task<IEnumerable<ServicoDto>> ListarTodosAsync();
    Task<ServicoDto?> ObterPorIdAsync(int id);
    Task<ServicoDto?> CriarServicoDiagnosticoAsync(ServicoCriacaoDto dto);
    Task<bool> AtualizarEstadoAsync(int id, string novoEstado);
}