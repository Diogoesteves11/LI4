using MobiFix.API.Models.Utilizadores;
using MobiFix.API.Repositories;
using MobiFix.API.DTOs;
namespace MobiFix.API.Services.GestaoUtilizadores;

public class UtilizadoresService : IGestaoUtilizadores
{
    private readonly IClienteRepository _clienteRepo;
    private readonly IFuncionarioRepository _funcRepo;
    private readonly ITrotineteRepository _trotiRepo;

    public UtilizadoresService(
        IClienteRepository clienteRepo,
        IFuncionarioRepository funcRepo,
        ITrotineteRepository trotiRepo)
    {
        _clienteRepo = clienteRepo;
        _funcRepo = funcRepo;
        _trotiRepo = trotiRepo;
    }

    public async Task<Cliente?> LoginCliente(string email, string passwordText)
    {
        var cliente = await _clienteRepo.ObterPorEmailAsync(email);
        if (cliente == null) return null;

        return BCrypt.Net.BCrypt.Verify(passwordText, cliente.PasswordHash) ? cliente : null;
    }

    public async Task<Funcionario?> LoginFuncionario(string numero, string passwordText)
    {
        var funcionario = await _funcRepo.GetByNumeroAsync(numero);
        if (funcionario == null || !funcionario.Ativo) return null;

        return BCrypt.Net.BCrypt.Verify(passwordText, funcionario.PasswordHash) ? funcionario : null;
    }

    public async Task<bool> RegistarCliente(string nome, string nif, string email, string contacto, string? morada, string passwordText)
    {
        if (await _clienteRepo.ExisteClientePorEmailAsync(email)) return false;

        string hash = BCrypt.Net.BCrypt.HashPassword(passwordText);
        var cliente = new Cliente(nif, nome, email, contacto, hash) { Morada = morada };

        return await _clienteRepo.RegistarAsync(cliente);
    }

    public async Task<bool> EditarDadosCliente(string email, string? novoContacto, string? novaMorada)
    {
        var campos = new Dictionary<string, object>();
        if (!string.IsNullOrWhiteSpace(novoContacto)) campos.Add("Telefone", novoContacto);
        if (!string.IsNullOrWhiteSpace(novaMorada)) campos.Add("Morada", novaMorada);

        if (campos.Count == 0) return true;

        return await _clienteRepo.AtualizarParcialPorEmailAsync(email, campos);
    }

    public async Task<Cliente?> GetCliente(string email)
    {
        return await _clienteRepo.ObterPorEmailAsync(email, true);
    }

    public async Task<bool> RegistarTrotinete(string email, string marca, string modelo, string numSerie)
    {
        var body = new TrotineteDto
        {
            Marca = marca,
            Modelo = modelo,
            NumeroSerie = numSerie
        };

        return await _trotiRepo.CriarComEmailAsync(body, email);
    }

    public async Task<Funcionario?> GetFuncionario(string numero)
    {
        return await _funcRepo.GetByNumeroAsync(numero);
    }

    public async Task<bool> RegistarFuncionario(string numero, string nome, string email, string contacto, string cargo, string? especialidade, string passwordText)
    {
        if (await _funcRepo.ExisteFuncionarioAsync(numero)) return false;

        string hash = BCrypt.Net.BCrypt.HashPassword(passwordText);

        Funcionario novoFuncionario = cargo switch
        {
            "Mecanico" => new Mecanico(numero, nome, email, contacto, hash, true, especialidade),
            "Administrador" => new Administrador(numero, nome, email, contacto, hash, true),
            "Operador" => new Operador(numero, nome, email, contacto, hash, true),
            _ => throw new ArgumentException("Cargo inválido.")
        };

        return await _funcRepo.RegistarFuncionarioAsync(novoFuncionario);
    }

    public async Task<bool> EditarDadosFuncionario(string numero, string? nome, string? email, string? cargo)
    {
        var campos = new Dictionary<string, object>();
        if (!string.IsNullOrWhiteSpace(nome)) campos.Add("Nome", nome);
        if (!string.IsNullOrWhiteSpace(email)) campos.Add("Email", email);

        if (!string.IsNullOrWhiteSpace(cargo))
        {
            var cargosValidos = new[] { "Mecanico", "Administrador", "Operador" };
            if (!cargosValidos.Contains(cargo)) return false;
            campos.Add("Cargo", cargo);
        }

        if (campos.Count == 0) return true;

        return await _funcRepo.AtualizarParcialAsync(numero, campos);
    }

    public async Task<bool> DesativarFuncionario(string numero)
    {
        return await _funcRepo.DesativarFuncionarioAsync(numero);
    }
        
    public async Task<bool> AtivarFuncionario(string numero)
    {
        return await _funcRepo.AtivarFuncionarioAsync(numero);
    }

    public async Task<bool> AlterarCargoFuncionario(string numero, string novoCargo)
    {
        var cargosValidos = new[] { "Mecanico", "Administrador", "Operador" };
        if (!cargosValidos.Contains(novoCargo)) return false;

        return await _funcRepo.AtualizarParcialAsync(numero, new Dictionary<string, object> { { "Cargo", novoCargo } });
    }
}
