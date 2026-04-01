namespace Backend.Services;

using Backend.Models;

public interface IPecaService
{
    Task<IEnumerable<PecaDto>> GetTodasPecasAsync();
}