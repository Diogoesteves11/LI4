namespace MobiFix.API.Repositories;

using MobiFix.API.Models.Stocks;

public interface iPecaRepository {
    Task<Peca?> GetByEAN(string EAN);
    Task<bool> AtualizarStock(string EAN, int stock);
    Task<bool> DesativarPeca(string EAN);
    Task<bool> AtivarPeca(string EAN);
    Task<bool> AtualizarDadosParcial(string EAN, object dados);
}