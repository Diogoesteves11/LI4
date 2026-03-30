using MobiFix.API.DTOs;
using MobiFix.API.Models.Financas;
using MobiFix.API.Repositories;

namespace MobiFix.API.Services.GestaoFinanceira;

public class FinancasService : IGestaoFinancas
{
    private readonly IFaturaRepository _faturaRepo;
    private readonly IDevolucaoRepository _devolucaoRepo;
    private readonly INotaCreditoRepository _notaCreditoRepo;
    private readonly IPecaRepository _pecaRepo;

    public FinancasService(
        IFaturaRepository faturaRepo,
        IDevolucaoRepository devolucaoRepo,
        INotaCreditoRepository notaCreditoRepo,
        IPecaRepository pecaRepo)
    {
        _faturaRepo = faturaRepo;
        _devolucaoRepo = devolucaoRepo;
        _notaCreditoRepo = notaCreditoRepo;
        _pecaRepo = pecaRepo;
    }

    public async Task<FaturaDto?> EmitirFatura(CriarFaturaRequest request)
    {
        var metodosValidos = new[] { "MBWay", "Multibanco", "Numerário" };
        if (!metodosValidos.Contains(request.MetodoPagamento)) return null;
        if (request.ValorTotal < 0) return null;

        var dto = new FaturaDto
        {
            NumeroFatura = $"FAT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
            DataEmissao = DateTime.UtcNow,
            ClienteID = request.ClienteID,
            ServicoID = request.ServicoID,
            VendaID = request.VendaID,
            ValorTotal = request.ValorTotal,
            MetodoPagamento = request.MetodoPagamento
        };

        return await _faturaRepo.CriarAsync(dto);
    }

    public async Task<List<FaturaDto>> ObterFaturasCliente(int clienteId)
    {
        return await _faturaRepo.ObterPorClienteAsync(clienteId);
    }

    public async Task<FaturaDto?> ObterFatura(int faturaId)
    {
        return await _faturaRepo.ObterPorIdAsync(faturaId);
    }

    public async Task<DevolucaoDto?> RegistarDevolucao(int faturaId, string motivo)
    {
        var fatura = await _faturaRepo.ObterPorIdAsync(faturaId);
        if (fatura == null) return null;

        var devDto = new DevolucaoDto
        {
            FaturaID = faturaId,
            DataDevolucao = DateTime.UtcNow,
            Motivo = motivo
        };

        var devolucao = await _devolucaoRepo.CriarAsync(devDto);
        if (devolucao == null) return null;

        // Criar nota de crédito automática
        await _notaCreditoRepo.CriarAsync(new NotaCreditoDto
        {
            DevolucaoID = devolucao.DevolucaoID,
            ValorCreditado = fatura.ValorTotal
        });

        return devolucao;
    }

    public async Task<Relatorio> GerarRelatorio(DateTime inicio, DateTime fim)
    {
        var todasFaturas = await _faturaRepo.ObterTodasAsync();
        var faturasPeriodo = todasFaturas.Where(f => f.DataEmissao >= inicio && f.DataEmissao <= fim).ToList();

        var totalServicos = faturasPeriodo.Count(f => f.ServicoID != null);
        var totalVendas = faturasPeriodo.Count(f => f.VendaID != null);
        var receitaTotal = faturasPeriodo.Sum(f => f.ValorTotal);
        var ticketMedio = faturasPeriodo.Count > 0 ? receitaTotal / faturasPeriodo.Count : 0;

        return new Relatorio
        {
            DataInicio = inicio,
            DataFim = fim,
            ReceitaTotal = receitaTotal,
            TotalServicos = totalServicos,
            TotalVendas = totalVendas,
            TicketMedio = ticketMedio
        };
    }

    public async Task<List<ItemInventario>> ObterInventario()
    {
        var pecas = await _pecaRepo.GetAllAsync();

        return pecas.Select(p => new ItemInventario
        {
            CodigoEAN = p.CodigoEAN,
            Nome = p.Nome,
            StockAtual = p.StockAtual,
            StockMinimo = p.StockMinimo,
            PVP = p.PVP,
            CustoAquisicao = p.CustoAquisicao
        }).ToList();
    }
}
