namespace MobiFix.API.Models.Utilizadores;

public class Cliente
{
    public int Id { get; set; }
    public string Nif { get; private set; }
    public string Nome { get; set; }
    public string Email { get; private set; }
    public string Contacto { get; set; }
    public string? Morada { get; set; }
    public string PasswordHash { get; private set; }

    public List<Trotinete> Trotinetes { get; set; } = new();

    public Cliente(string nif, string nome, string email, string contacto, string passwordHash)
    {
        Nif = nif;
        Nome = nome;
        Email = email;
        Contacto = contacto;
        PasswordHash = passwordHash;
    }

    public void AlterarPassword(string novoHash) => PasswordHash = novoHash;
}
