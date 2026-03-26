namespace MobiFix.API.Models.Utilizadores;


using System;


public class Operador : Funcionario{
    public Operador (string numero, string email, string contacto, string passwordHash) : base (numero, email, contacto, passwordHash){}
}