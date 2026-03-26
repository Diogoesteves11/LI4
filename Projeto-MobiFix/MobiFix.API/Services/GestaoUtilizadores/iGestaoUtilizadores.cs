using MobiFix.API.Models.Utilizadores;

namespace MobiFix.API.Services.GestaoUtilizadores;


public interface iGestaoUtilizadores {
    public bool LoginCliente(string nif, string password);

    public bool LoginFuncionario(string numero, string password);

    public bool RegistarCliente(Cliente c);

    public bool EditarDadosCliente(string novoContacto, string novaMorada, string novoEmail);

    public bool RegistarTrotinete(string nif, string marca, string modelo, string numSerie);

    public Cliente GetCliente(string nif);

    public Funcionario GetFuncionario(string numero);

    public bool RegistarFuncionario(Funcionario f);

    public bool DesativarFuncionario(string numero);

    public bool AlterarCargoFuncionario(string numeroFunc, string novoCargo);
}