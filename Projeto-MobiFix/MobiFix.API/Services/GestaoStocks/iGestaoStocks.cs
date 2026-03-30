using MobiFix.API.DTOs;
using MobiFix.API.Models.Stocks;

namespace MobiFix.API.Services.GestaoStocks;

public interface IGestaoStocks
{
    // Peças
    Task<Peca?> ObterPeca(string ean);
    Task<List<PecaDto>> ObterTodasPecas();
    Task<bool> AtualizarStockPeca(string ean, int novoStock);
    Task<bool> EditarPeca(string ean, object dados);
    Task<bool> DesativarPeca(string ean);

    // Encomendas Stock
    Task<EncomendaStockDto?> CriarEncomendaStock(int pecaId, int quantidade, int adminId);
    Task<List<EncomendaStockDto>> ObterEncomendasStock();
    Task<bool> RececionarEncomendaStock(int encomendaId, int operadorId);

    // Promoções
    Task<PromocaoDto?> CriarPromocao(CriarPromocaoRequest request);
    Task<List<PromocaoDto>> ObterPromocoes();
    Task<bool> EliminarPromocao(int promocaoId);

    // Encomendas Cliente (Click & Collect)
    Task<EncomendaClienteDto?> CriarEncomendaCliente(CriarEncomendaClienteRequest request);
    Task<List<EncomendaClienteDto>> ObterEncomendasCliente(int clienteId);
    Task<bool> LevantarEncomendaCliente(int encomendaId);
}
