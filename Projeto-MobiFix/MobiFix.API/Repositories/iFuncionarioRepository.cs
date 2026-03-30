using MobiFix.API.Models.Utilizadores;

namespace MobiFix.API.Repositories;

public interface IFuncionarioRepository
{
    Task<Funcionario?> GetByNumeroAsync(string numeroFunc);
    Task<bool> RegistarFuncionarioAsync(Funcionario f);
    Task<bool> DesativarFuncionarioAsync(string numero);
    Task<bool> AtivarFuncionarioAsync(string numero);
    Task<bool> ExisteFuncionarioAsync(string numero);
    Task<bool> AtualizarParcialAsync(string numero, object dados);
}
