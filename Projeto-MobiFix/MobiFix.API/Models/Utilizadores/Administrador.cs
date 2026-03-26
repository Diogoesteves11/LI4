namespace MobiFix.API.Models.Utilizadores;


using System;


public class Administrador : Funcionario{
    public Administrador (string numero, string email, string contacto, string passwordHash, bool ativo) 
                            : base (numero, email, contacto, passwordHash, ativo){}
}