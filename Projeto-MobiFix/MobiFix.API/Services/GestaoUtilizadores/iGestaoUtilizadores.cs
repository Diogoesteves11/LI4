using MobiFix.API.Models.Utilizadores;

namespace MobiFix.API.Services.GestaoUtilizadores;

public interface IGestaoUtilizadores
{
    Task<Cliente?> LoginCliente(string email, string passwordText);
    Task<Funcionario?> LoginFuncionario(string numero, string passwordText);
    Task<bool> RegistarCliente(string nome, string nif, string email, string contacto, string? morada, string passwordText);
    Task<bool> EditarDadosCliente(string email, string? novoContacto, string? novaMorada);
    Task<bool> EditarDadosFuncionario(string numero, string? nome, string? email, string? cargo);
    Task<bool> RegistarTrotinete(string email, string marca, string modelo, string numSerie);
    Task<Cliente?> GetCliente(string email);
    Task<Funcionario?> GetFuncionario(string numero);
    Task<bool> RegistarFuncionario(string numero, string nome, string email, string contacto, string cargo, string? especialidade, string passwordText);
    Task<bool> DesativarFuncionario(string numero);
    Task<bool> AtivarFuncionario(string numero);
    Task<bool> AlterarCargoFuncionario(string numero, string novoCargo);
}
