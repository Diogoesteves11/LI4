namespace Backend.Models;

public class FuncionarioDto
{
    public string NumeroMecanografico {get; set;}
    public string Nome {get; set;}
    public string Email {get; set;}
    public string Contacto {get; set;}
    public string Cargo { get; set; }
    public string PasswordHash {get;set;}
    public string? Especialidade {get;set;}
    public bool Ativo {get;set;}
}