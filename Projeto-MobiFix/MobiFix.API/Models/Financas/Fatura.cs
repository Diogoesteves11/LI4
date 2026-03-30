namespace MobiFix.API.Models.Financas;

using MobiFix.API.Models;
using System.Collections.Generic;
public class Fatura{
    public string numero {get; private set;}
    public int sequencial {get; private set;}
    public string? nif {get; private set;}
    public Date data {get; private get;}

}