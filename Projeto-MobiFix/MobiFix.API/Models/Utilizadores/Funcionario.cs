namespace MobiFix.API.Models.Utilizadores;

public class Funcionario
{
    // 1. Propriedades com 'private set' para garantir o encapsulamento
    public int Id { get; private set; }
    public string Numero { get; private set; }
    public string Nome { get; private set; }
    public string Email { get; private set; }
    public string Contacto { get; private set; }
    public string PasswordHash { get; private set; }
    public bool Ativo { get; private set; }

    public Funcionario(string numero, string nome, string email, string contacto, string passwordHash, bool ativo = true, int id = 0)
    {
        if (string.IsNullOrWhiteSpace(nome)) throw new ArgumentException("O nome é obrigatório.");
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("O email é obrigatório.");

        Id = id;
        Numero = numero;
        Nome = nome;
        Email = email;
        Contacto = contacto;
        PasswordHash = passwordHash;
        Ativo = ativo;
    }
    public void Desativar() => Ativo = false;
    public void Ativar() => Ativo = true;

    public void AtualizarDados(string nome, string email, string contacto)
    {
        Nome = nome;
        Email = email;
        Contacto = contacto;
    }

    public bool AlterarPassword(string novoHash)
    {
        if (string.IsNullOrWhiteSpace(novoHash) || PasswordHash == novoHash) 
            return false;

        PasswordHash = novoHash;
        return true;
    }
}