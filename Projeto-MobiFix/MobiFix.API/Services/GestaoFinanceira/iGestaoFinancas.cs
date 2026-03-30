using MobiFix.API.DTOs;
using MobiFix.API.Models.Financas;

namespace MobiFix.API.Services.GestaoFinanceira;

public interface IGestaoFinancas
{
    Task<FaturaDto?> EmitirFatura(CriarFaturaRequest request);
    Task<List<FaturaDto>> ObterFaturasCliente(int clienteId);
    Task<FaturaDto?> ObterFatura(int faturaId);
    Task<DevolucaoDto?> RegistarDevolucao(int faturaId, string motivo);
    Task<Relatorio> GerarRelatorio(DateTime inicio, DateTime fim);
    Task<List<ItemInventario>> ObterInventario();
}
