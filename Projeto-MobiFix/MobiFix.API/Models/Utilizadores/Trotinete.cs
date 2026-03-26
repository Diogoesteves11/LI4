namespace MobiFix.API.Models.Utilizadores;



public class Trotinete{
    public string NumeroSerie {get; private set;}
    public string Marca {get; private set;}

    public string Modelo {get; private set;}

    bool emServico {get; set;}

    public Trotinete (string numSerie, string marca, string modelo) {
        NumeroSerie = numSerie;
        Marca = marca;
        Modelo = modelo;
        emServico = false;
    }
}