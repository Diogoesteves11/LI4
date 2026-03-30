namespace MobiFix.API.Models.Utilizadores;

public class Trotinete
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string NumeroSerie { get; private set; }
    public string Marca { get; private set; }
    public string Modelo { get; private set; }
    public bool EmServico { get; set; }

    public Trotinete(string numSerie, string marca, string modelo)
    {
        NumeroSerie = numSerie;
        Marca = marca;
        Modelo = modelo;
        EmServico = false;
    }
}
