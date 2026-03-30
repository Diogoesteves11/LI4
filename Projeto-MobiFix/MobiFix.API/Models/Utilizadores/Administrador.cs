namespace MobiFix.API.Models.Utilizadores;

public class Administrador : Funcionario
{
    public Administrador(string numero, string nome, string email, string contacto, string passwordHash, bool ativo)
        : base(numero, nome, email, contacto, passwordHash, ativo) { }
}
