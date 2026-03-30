using MobiFix.API.Models.Utilizadores;

namespace MobiFix.API.Repositories;

public interface iClienteRepository{
    public Task<Funcionario?> GetByNumeroAsync(string numeroFunc);
    public Task<bool> RegistarFuncionarioAsync(Funcionario f);
    public Task<bool> DesativarFuncionarioAsync(string numero);
    public Task<bool> AtivarFuncionarioAsync(string numero);

    public async Task<bool> ExisteFuncionarioAsync(string numero);

    public async Task<bool> AtualizarParcialAsync(string numero, object dados);
}