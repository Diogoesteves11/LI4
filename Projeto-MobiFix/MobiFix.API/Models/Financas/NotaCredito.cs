namespace MobiFix.API.Models.Financas;

public class NotaCredito
{
    public int Id { get; set; }
    public int DevolucaoID { get; set; }
    public decimal ValorCreditado { get; set; }
}
