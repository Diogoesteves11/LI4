namespace Backend.Services;

using Backend.Models;

public interface IServicoService
{
    Task<IEnumerable<ServicoDto>> ListarTodosAsync();
    Task<ServicoDto?> ObterPorIdAsync(int id);
    Task<ServicoDto?> CriarServicoDiagnosticoAsync(ServicoCriacaoDto dto);
    Task<ServicoDto?> AtualizarServicoAsync(int id, ServicoDto dto);
}