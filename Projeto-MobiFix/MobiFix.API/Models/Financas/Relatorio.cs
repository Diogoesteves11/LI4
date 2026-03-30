namespace MobiFix.API.Models.Financas;

public class Relatorio
{
    public decimal ReceitaTotal { get; set; }
    public int TotalServicos { get; set; }
    public int TotalVendas { get; set; }
    public decimal TicketMedio { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
}
