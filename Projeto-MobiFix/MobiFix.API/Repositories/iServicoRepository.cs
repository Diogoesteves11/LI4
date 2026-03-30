using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IServicoRepository
{
    Task<ServicoDto?> ObterPorIdAsync(int id);
    Task<List<ServicoDto>> ObterPorTrotineteAsync(int trotineteId);
    Task<ServicoDto?> CriarAsync(ServicoDto dto);
    Task<bool> AtualizarEstadoAsync(int servicoId, string novoEstado);
    Task<bool> AtualizarParcialAsync(int servicoId, object dados);
    Task<List<ServicoDto>> ObterTodosAsync();
}
