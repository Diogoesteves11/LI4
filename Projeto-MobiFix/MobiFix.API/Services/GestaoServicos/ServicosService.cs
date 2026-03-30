using MobiFix.API.DTOs;
using MobiFix.API.Repositories;

namespace MobiFix.API.Services.GestaoServicos;

public class ServicosService : IGestaoServicos
{
    private readonly IServicoRepository _servicoRepo;
    private readonly IServicoIntervencaoRepository _intervencaoRepo;
    private readonly ICatalogoIntervencoesRepository _catalogoRepo;
    private readonly IPecaRepository _pecaRepo;

    public ServicosService(
        IServicoRepository servicoRepo,
        IServicoIntervencaoRepository intervencaoRepo,
        ICatalogoIntervencoesRepository catalogoRepo,
        IPecaRepository pecaRepo)
    {
        _servicoRepo = servicoRepo;
        _intervencaoRepo = intervencaoRepo;
        _catalogoRepo = catalogoRepo;
        _pecaRepo = pecaRepo;
    }

    public async Task<ServicoDto?> CriarServico(int trotineteId, DateTime dataAgendamento, string? feedbackCliente)
    {
        var dto = new ServicoDto
        {
            TrotineteID = trotineteId,
            Estado = "Agendado",
            DataAgendamento = dataAgendamento,
            FeedbackCliente = feedbackCliente,
            Preco = 0
        };

        return await _servicoRepo.CriarAsync(dto);
    }

    public async Task<ServicoDto?> ObterServico(int servicoId)
    {
        return await _servicoRepo.ObterPorIdAsync(servicoId);
    }

    public async Task<List<ServicoDto>> ObterServicosPorTrotinete(int trotineteId)
    {
        return await _servicoRepo.ObterPorTrotineteAsync(trotineteId);
    }

    public async Task<List<ServicoDto>> ObterTodosServicos()
    {
        return await _servicoRepo.ObterTodosAsync();
    }

    public async Task<bool> IniciarExecucao(int servicoId)
    {
        var servico = await _servicoRepo.ObterPorIdAsync(servicoId);
        if (servico == null || servico.Estado != "Agendado") return false;

        return await _servicoRepo.AtualizarEstadoAsync(servicoId, "Em Execução");
    }

    public async Task<bool> RegistarDiagnostico(int servicoId, string descricao)
    {
        var servico = await _servicoRepo.ObterPorIdAsync(servicoId);
        if (servico == null) return false;

        return await _servicoRepo.AtualizarParcialAsync(servicoId, new { DescricaoDiagnostico = descricao });
    }

    public async Task<bool> ConcluirServico(int servicoId)
    {
        var servico = await _servicoRepo.ObterPorIdAsync(servicoId);
        if (servico == null || servico.Estado != "Em Execução") return false;

        // Calcular preço total: soma das intervenções (mão de obra) + peças
        var intervencoes = await _intervencaoRepo.ObterPorServicoAsync(servicoId);
        decimal precoTotal = 0;

        foreach (var interv in intervencoes)
        {
            var catalogo = await _catalogoRepo.ObterPorIdAsync(interv.IntervencaoID);
            if (catalogo != null)
                precoTotal += catalogo.PrecoFixoMaoDeObra;
        }

        return await _servicoRepo.AtualizarParcialAsync(servicoId, new
        {
            Estado = "Concluido",
            DataConclusao = DateTime.UtcNow,
            Preco = precoTotal
        });
    }

    public async Task<bool> FecharServico(int servicoId)
    {
        var servico = await _servicoRepo.ObterPorIdAsync(servicoId);
        if (servico == null || servico.Estado != "Concluido") return false;

        return await _servicoRepo.AtualizarEstadoAsync(servicoId, "Fechado");
    }

    public async Task<bool> AtribuirIntervencao(int servicoId, int intervencaoId, int mecanicoId)
    {
        var dto = new ServicoIntervencaoDto
        {
            ServicoID = servicoId,
            IntervencaoID = intervencaoId,
            MecanicoID = mecanicoId,
            DataInicio = DateTime.UtcNow
        };

        return await _intervencaoRepo.AtribuirIntervencaoAsync(dto);
    }

    public async Task<bool> ConcluirIntervencao(int servicoId, int intervencaoId)
    {
        return await _intervencaoRepo.ConcluirIntervencaoAsync(servicoId, intervencaoId);
    }

    public async Task<bool> RegistarPecaIntervencao(int servicoId, int intervencaoId, int pecaId, int quantidade)
    {
        var dto = new IntervencaoPecaDto
        {
            ServicoID = servicoId,
            IntervencaoID = intervencaoId,
            PecaID = pecaId,
            Quantidade = quantidade
        };

        return await _intervencaoRepo.RegistarPecaAsync(dto);
    }

    public async Task<List<ServicoIntervencaoDto>> ObterIntervencoesPorServico(int servicoId)
    {
        return await _intervencaoRepo.ObterPorServicoAsync(servicoId);
    }

    public async Task<List<IntervencaoCatalogoDto>> ObterCatalogoIntervencoes()
    {
        return await _catalogoRepo.ObterTodosAsync();
    }
}
