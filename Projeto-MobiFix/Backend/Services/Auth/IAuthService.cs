namespace Backend.Services;
using Backend.Models;

public interface IAuthService
{
    Task<string?> LoginAsync(FuncionarioLoginDto LoginDto);
}