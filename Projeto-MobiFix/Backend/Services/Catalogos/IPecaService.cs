namespace Backend.Services;

using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPecaService
{
    Task<IEnumerable<PecaDto>> GetTodasPecasAsync();
    Task<PecaDto?> GetPecaPorEanAsync(string ean);
    Task<PecaDto?> CriarPecaAsync(PecaDto novaPeca);
    Task<PecaDto?> AtualizarPecaAsync(string ean, PecaDto pecaAtualizada);
    Task<PecaDto?> AlterarEstadoPecaAsync(string ean, bool ativo);
    Task<bool> EliminarPecaAsync(string ean);
}