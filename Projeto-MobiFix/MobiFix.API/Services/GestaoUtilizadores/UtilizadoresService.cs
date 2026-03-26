namespace MobiFix.API.Services.GestaoUtilizadores;

using MobiFix.API.Models.Utilizadores;
using MobiFix.API.Repositories;
using BCrypt.Net; 

public class UtilizadoresService : iGestaoUtilizadores
{
    private readonly iClienteRepository _clienteRepo;

    public UtilizadoresService(iClienteRepository clienteRepo){
        _clienteRepo = clienteRepo;
    }

    public async Task<bool> LoginCliente(string nif, string passwordLimpa){

        var cliente = await _clienteRepo.ObterPorNifAsync(nif);
        if (cliente == null) return false;

        bool passwordCorreta = BCrypt.Verify(passwordLimpa, cliente.PasswordHash);

        return passwordCorreta;
    }
}