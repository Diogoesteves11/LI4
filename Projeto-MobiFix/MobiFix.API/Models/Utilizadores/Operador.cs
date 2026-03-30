namespace MobiFix.API.Models.Utilizadores;

public class Operador : Funcionario
{
    public Operador(string numero, string nome, string email, string contacto, string passwordHash, bool ativo = true, int id = 0)
        : base(numero, nome, email, contacto, passwordHash, ativo, id) { }
}
