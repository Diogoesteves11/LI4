namespace MobiFix.API.Models.Utilizadores;

public enum EspecialidadeTipo
{
    DIAGNOSTICO,
    MECANICA_GERAL,
    ELETRICISTA
}

public class Mecanico : Funcionario
{
    public string? Especialidade { get; private set; }

    public Mecanico(string numero, string nome, string email, string contacto, string passwordHash, bool ativo, string? especialidade, int id = 0)
        : base(numero, nome, email, contacto, passwordHash, ativo, id)
    {
        Especialidade = especialidade;
    }
}
