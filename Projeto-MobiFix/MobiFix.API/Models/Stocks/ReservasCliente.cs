namespace MobiFix.API.Models.Stocks;

public class ReservasCliente
{
    public string Codigo { get; private set; }
    public string IdCliente { get; private set; }
    public string Status { get; private set; }
    public Dictionary<string, int> Pecas { get; private set; }

    public ReservasCliente(string codigo, string idCliente, Dictionary<string, int> pecas)
    {
        Codigo = codigo;
        IdCliente = idCliente;
        Pecas = pecas ?? new Dictionary<string, int>();
        Status = "Pendente";
    }

    public bool Entregar()
    {
        if (Status == "Entregue") return false;
        
        Status = "Entregue";
        return true;
    }
}