namespace MobiFix.API.Services.GestaoUtilizadores;

using MobiFix.API.Models.GestaoUtilizadores;
using MobiFix.API.Repositories;
using MobiFix.API.DTOs;
using BCrypt.Net;

public class UtilizadoresService : iGestaoUtilizadores
{
    private readonly iClienteRepository _clienteRepo;
    private readonly iFuncionarioRepository _funcRepo;
    private readonly iTrotineteRepository _trotiRepo;

    public UtilizadoresService(
        iClienteRepository clienteRepo, 
        iFuncionarioRepository funcRepo, 
        iTrotineteRepository trotiRepo) 
    {
        _clienteRepo = clienteRepo;
        _funcRepo = funcRepo;
        _trotiRepo = trotiRepo;
    }
    public async Task<bool> LoginCliente(string email, string passwordText)
    {
        var cliente = await _clienteRepo.ObterPorEmailAsync(nif);
        if (cliente == null) return false;

        return BCrypt.Verify(passwordText, cliente.PasswordHash);
    }

    public async Task<bool> LoginFuncionario(string numero, string passwordText) 
    {
        var funcionario = await _funcRepo.GetByNumeroAsync(numero);
        if (funcionario == null || !funcionario.Ativo) return false;

        return BCrypt.Verify(passwordText, funcionario.PasswordHash);
    }


    public async Task<bool> RegistarCliente(string nome, string nif, string email, string contacto, string morada, string passwordText) 
    {   
        if(_clienteRepo.ExisteClienteAsync(nif)) return false;
        string hash = BCrypt.HashPassword(passwordText);
        var cliente = new Cliente(nif, nome, email, contacto, hash);
        
        return await _clienteRepo.RegistarAsync(cliente);
    }

    public async Task<bool> EditarDadosCliente(string email, string? novoContacto, string? novaMorada) 
    {
        var campos = new Dictionary<string, object>();
        if (!string.IsNullOrWhiteSpace(novoContacto)) campos.Add("Telefone", novoContacto);
        if (!string.IsNullOrWhiteSpace(novaMorada))   campos.Add("Morada", novaMorada);

        if (campos.Count == 0) return true;

        return await _clienteRepo.AtualizarParcialAsync(email, campos);
    }

    public async Task<Cliente?> GetCliente(string email) => await _clienteRepo.ObterPorEmailAsync(nif, true);


    public async Task<bool> RegistarTrotinete(string email, string marca, string modelo, string numSerie)
    {
        var dto = new TrotineteDto 
        { 
            Marca = marca, 
            Modelo = modelo, 
            NumeroSerie = numSerie,
            EmServico = false
        };

        return await _trotiRepo.CriarComNifAsync(dto, email);
    }

    public async Task<bool> AlterarEstadoReparacaoTrotinete(string numSerie, bool estado){
        return _trotiRepo.AlterarEstadoTrotinete(numSerie, estado);
    }


    public async Task<Funcionario?> GetFuncionario(string numero) => await _funcRepo.GetByNumeroAsync(numero);

    public async Task<bool> RegistarFuncionario(string numero, string nome, string email, string contacto, string cargo, string? especialidade, string passwordText) 
    {   
        if(_funcRepo.ExisteFuncionarioAsync(numero)) return false;
        string hash = BCrypt.HashPassword(passwordText);

        Funcionario novoFuncionario = cargo switch
        {
            "Mecanico" => new Mecanico(numero, nome, email, contacto, hash, true, especialidade),
            "Administrador" => new Administrador(numero, nome, email, contacto, hash, true),
            "Operador" => new Operador(numero, nome, email, contacto, hash, true),
            _ => throw new ArgumentException("Cargo inválido ou não reconhecido pelo sistema.")
        };

        return await _funcRepo.RegistarFuncionarioAsync(novoFuncionario);
    }

    public async Task<bool> DesativarFuncionario(string numero) => await _funcRepo.DesativarFuncionarioAsync(numero);

    public async Task<bool> AlterarCargoFuncionario(string numeroFunc, string novoCargo)
    {
        var cargosValidos = new[] { "Mecanico", "Administrador", "Operador" };
        if (!cargosValidos.Contains(novoCargo)) return false;

        var dados = new Dictionary<string, object> { { "Cargo", novoCargo } };
        
        return await _funcRepo.AtualizarCargoAsync(numeroFunc, novoCargo);
    }
}