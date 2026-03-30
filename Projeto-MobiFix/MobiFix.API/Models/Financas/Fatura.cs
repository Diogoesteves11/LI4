namespace MobiFix.API.Models.Financas;

public class Fatura
{
    public int Id { get; set; }
    public string NumeroFatura { get; set; } = string.Empty;
    public DateTime DataEmissao { get; set; }
    public int ClienteID { get; set; }
    public int? ServicoID { get; set; }
    public int? VendaID { get; set; }
    public decimal ValorTotal { get; set; }
    public string MetodoPagamento { get; set; } = string.Empty;
}
