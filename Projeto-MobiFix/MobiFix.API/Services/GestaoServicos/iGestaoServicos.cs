using MobiFix.API.DTOs;

namespace MobiFix.API.Services.GestaoServicos;

public interface IGestaoServicos
{
    Task<ServicoDto?> CriarServico(int trotineteId, DateTime dataAgendamento, string? feedbackCliente);
    Task<ServicoDto?> ObterServico(int servicoId);
    Task<List<ServicoDto>> ObterServicosPorTrotinete(int trotineteId);
    Task<List<ServicoDto>> ObterTodosServicos();
    Task<bool> IniciarExecucao(int servicoId);
    Task<bool> RegistarDiagnostico(int servicoId, string descricao);
    Task<bool> ConcluirServico(int servicoId);
    Task<bool> FecharServico(int servicoId);
    Task<bool> AtribuirIntervencao(int servicoId, int intervencaoId, int mecanicoId);
    Task<bool> ConcluirIntervencao(int servicoId, int intervencaoId);
    Task<bool> RegistarPecaIntervencao(int servicoId, int intervencaoId, int pecaId, int quantidade);
    Task<List<ServicoIntervencaoDto>> ObterIntervencoesPorServico(int servicoId);
    Task<List<IntervencaoCatalogoDto>> ObterCatalogoIntervencoes();
}
