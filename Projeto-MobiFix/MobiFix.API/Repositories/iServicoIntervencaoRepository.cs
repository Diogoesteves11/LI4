using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IServicoIntervencaoRepository
{
    Task<bool> AtribuirIntervencaoAsync(ServicoIntervencaoDto dto);
    Task<bool> ConcluirIntervencaoAsync(int servicoId, int intervencaoId);
    Task<List<ServicoIntervencaoDto>> ObterPorServicoAsync(int servicoId);
    Task<bool> RegistarPecaAsync(IntervencaoPecaDto dto);
}
