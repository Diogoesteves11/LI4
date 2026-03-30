using MobiFix.API.DTOs;
using MobiFix.API.Models.Stocks;
using MobiFix.API.Repositories;

namespace MobiFix.API.Services.GestaoStocks;

public class StockService : IGestaoStocks
{
    private readonly IPecaRepository _pecaRepo;
    private readonly IEncomendaStockRepository _encStockRepo;
    private readonly IPromocaoRepository _promoRepo;
    private readonly IEncomendaClienteRepository _encClienteRepo;

    public StockService(
        IPecaRepository pecaRepo,
        IEncomendaStockRepository encStockRepo,
        IPromocaoRepository promoRepo,
        IEncomendaClienteRepository encClienteRepo)
    {
        _pecaRepo = pecaRepo;
        _encStockRepo = encStockRepo;
        _promoRepo = promoRepo;
        _encClienteRepo = encClienteRepo;
    }

    // ─── Peças ───

    public async Task<Peca?> ObterPeca(string ean)
    {
        return await _pecaRepo.GetByEAN(ean);
    }

    public async Task<List<PecaDto>> ObterTodasPecas()
    {
        return await _pecaRepo.GetAllAsync();
    }

    public async Task<bool> AtualizarStockPeca(string ean, int novoStock)
    {
        if (novoStock < 0) return false;
        return await _pecaRepo.AtualizarStock(ean, novoStock);
    }

    public async Task<bool> EditarPeca(string ean, object dados)
    {
        return await _pecaRepo.AtualizarDadosParcial(ean, dados);
    }

    public async Task<bool> DesativarPeca(string ean)
    {
        return await _pecaRepo.DesativarPeca(ean);
    }

    // ─── Encomendas Stock ───

    public async Task<EncomendaStockDto?> CriarEncomendaStock(int pecaId, int quantidade, int adminId)
    {
        if (quantidade <= 0) return null;

        var dto = new EncomendaStockDto
        {
            PecaID = pecaId,
            Quantidade = quantidade,
            Estado = "Pendente",
            DataPedido = DateTime.UtcNow,
            AdminValidadorID = adminId
        };

        return await _encStockRepo.CriarAsync(dto);
    }

    public async Task<List<EncomendaStockDto>> ObterEncomendasStock()
    {
        return await _encStockRepo.ObterTodasAsync();
    }

    public async Task<bool> RececionarEncomendaStock(int encomendaId, int operadorId)
    {
        var enc = await _encStockRepo.ObterPorIdAsync(encomendaId);
        if (enc == null || enc.Estado == "Rececionada") return false;

        return await _encStockRepo.AtualizarEstadoAsync(encomendaId, "Rececionada", operadorId);
    }

    // ─── Promoções ───

    public async Task<PromocaoDto?> CriarPromocao(CriarPromocaoRequest request)
    {
        if (request.DataFim < request.DataInicio) return null;
        if (request.PercentagemDesconto <= 0 || request.PercentagemDesconto > 100) return null;

        var dto = new PromocaoDto
        {
            Descricao = request.Descricao,
            PercentagemDesconto = request.PercentagemDesconto,
            DataInicio = request.DataInicio,
            DataFim = request.DataFim,
            AdministradorID = request.AdministradorID
        };

        var promo = await _promoRepo.CriarAsync(dto);
        if (promo == null) return null;

        foreach (var pecaId in request.PecaIDs)
        {
            await _promoRepo.AdicionarPecaPromocaoAsync(new PromocaoPecaDto
            {
                PromocaoID = promo.PromocaoID,
                PecaID = pecaId
            });
        }

        return promo;
    }

    public async Task<List<PromocaoDto>> ObterPromocoes()
    {
        return await _promoRepo.ObterTodasAsync();
    }

    public async Task<bool> EliminarPromocao(int promocaoId)
    {
        return await _promoRepo.EliminarAsync(promocaoId);
    }

    // ─── Encomendas Cliente ───

    public async Task<EncomendaClienteDto?> CriarEncomendaCliente(CriarEncomendaClienteRequest request)
    {
        if (request.Itens.Count == 0) return null;

        // Calcular total
        decimal total = 0;
        foreach (var item in request.Itens)
        {
            var pecas = await _pecaRepo.GetAllAsync();
            var peca = pecas.FirstOrDefault(p => p.PecaID == item.PecaID);
            if (peca == null) return null;
            if (peca.StockAtual < item.Quantidade) return null;
            total += peca.PVP * item.Quantidade;
        }

        var encomenda = await _encClienteRepo.CriarAsync(new EncomendaClienteDto
        {
            ClienteID = request.ClienteID,
            DataEncomenda = DateTime.UtcNow,
            Estado = "Pronto para Levantamento",
            Total = total
        });

        if (encomenda == null) return null;

        foreach (var item in request.Itens)
        {
            await _encClienteRepo.AdicionarItemAsync(new EncomendaClienteItemDto
            {
                EncomendaClienteID = encomenda.EncomendaClienteID,
                PecaID = item.PecaID,
                Quantidade = item.Quantidade
            });
        }

        return encomenda;
    }

    public async Task<List<EncomendaClienteDto>> ObterEncomendasCliente(int clienteId)
    {
        return await _encClienteRepo.ObterPorClienteAsync(clienteId);
    }

    public async Task<bool> LevantarEncomendaCliente(int encomendaId)
    {
        var enc = await _encClienteRepo.ObterPorIdAsync(encomendaId);
        if (enc == null || enc.Estado != "Pronto para Levantamento") return false;

        return await _encClienteRepo.AtualizarEstadoAsync(encomendaId, "Levantada");
    }
}
