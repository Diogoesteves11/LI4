using MobiFix.API.Models.Utilizadores;

namespace MobiFix.API.Services.GestaoUtilizadores;


public interface iGestaoUtilizadores {
    public async Task<bool> LoginCliente(string nif, string passwordText);

    public async Task<bool> LoginFuncionario(string numero, string passwordText);

    public async Task<bool> RegistarCliente(string nome, string nif, string email, string contacto, string morada, string passwordText);

    public async Task<bool> EditarDadosCliente(string nif, string? novoContacto, string? novaMorada);

    public async Task<bool> EditarDadosFuncionario(string numero, string? nome, string? email, string? cargo);

    public async Task<bool> RegistarTrotinete(string nif, string marca, string modelo, string numSerie);

    public async Task<Cliente?> GetCliente(string nif);

    public async Task<Funcionario?> GetFuncionario(string numero);

    public async Task<bool> RegistarFuncionario(Funcionario f);

    public async DesativarFuncionario(string numero);

    public async Task<bool> AlterarCargoFuncionario(string numeroFunc, string novoCargo);
}