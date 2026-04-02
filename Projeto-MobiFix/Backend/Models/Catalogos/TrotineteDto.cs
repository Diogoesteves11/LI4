namespace Backend.Models;

public class TrotineteDto
{
    public string NumeroSerie{get;set;} = string.Empty;
    public string Marca {get;set;} = string.Empty;
    public string Modelo {get;set;} = string.Empty;
    public string clienteId {get;set;} = string.Empty;
    public bool EmServico {get;set;}
}