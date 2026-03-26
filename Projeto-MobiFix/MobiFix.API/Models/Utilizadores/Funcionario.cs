namespace MobiFix.API.Models.Utilizadores;

public class Funcionario{
    public string Id {get; set;}
    public string Numero { get; private set; }
    public string Email { get; set; }
    public string Contacto { get; set; }
    public string PasswordHash { get; private set; }
    public bool Ativo {get; private set;}

    public Funcionario(string numero, string email, string contacto, string passwordHash, bool ativo)
    {
        Numero = numero;
        Email = email;
        Contacto = contacto;
        PasswordHash = passwordHash;
        Ativo = ativo;
    }

    public bool Login(string hashParaComparar) 
    {
        return PasswordHash == hashParaComparar; 
    }
    
    public void DesativarFuncionario() {Ativo = false;}
    public void AtivarFuncionario() {Ativo = true;}
    public bool AlterarPassword(string novoHash)
    {
        if (PasswordHash == novoHash) return false; 

        PasswordHash = novoHash;
        return true;
    }
}