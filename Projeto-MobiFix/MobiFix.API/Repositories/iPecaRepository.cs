using MobiFix.API.DTOs;
using MobiFix.API.Models.Stocks;

namespace MobiFix.API.Repositories;

public interface IPecaRepository
{
    Task<Peca?> GetByEAN(string EAN);
    Task<List<PecaDto>> GetAllAsync();
    Task<bool> AtualizarStock(string EAN, int stock);
    Task<bool> DesativarPeca(string EAN);
    Task<bool> AtivarPeca(string EAN);
    Task<bool> AtualizarDadosParcial(string EAN, object dados);
}
