namespace MobiFix.API.Models.Utilizadores;

using System;

public enum EspecialidadeTipo {
    DIAGNOSTICO,
    MECANICA_GERAL,
    ELETRICISTA
}

public class Mecanico : Funcionario {
    public string Especialidade { get; private set; }

    public Mecanico (string numero, string email, string contacto, string passwordHash,bool ativo , string? especialidade)
                    : base (numero, email, contacto, passwordHash, ativo) {

        if (!AlterarEspecialidade(especialidade)) {
            throw new ArgumentException($"A especialidade '{especialidade}' não é suportada.");
        }
    }

    public bool AlterarEspecialidade(string novaEspecialidade) {
        if (Enum.TryParse<EspecialidadeTipo>(novaEspecialidade, true, out var especialidadeConvertida)){
            Especialidade = especialidadeConvertida.ToString();
            return true;
        }

        return false;
    }
}