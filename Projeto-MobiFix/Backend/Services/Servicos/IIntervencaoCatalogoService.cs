namespace Backend.Services;

using Backend.Models;
public interface IIntervencaoCatalogoService
{
    Task<IEnumerable<IntervencaoCatalogoDto>> ListarTodasAsync();
    Task<IntervencaoCatalogoDto?> ObterPorIdAsync(string id);
}