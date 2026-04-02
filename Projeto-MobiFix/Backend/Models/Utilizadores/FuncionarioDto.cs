namespace Backend.Models;

public class FuncionarioDto
{
    public string NumeroMecanografico {get; set;} = string.Empty;
    public string Nome {get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public string Contacto {get; set;} = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string PasswordHash {get;set;} = string.Empty;
    public string? Especialidade {get;set;} = string.Empty;
    public bool Ativo {get;set;}
}