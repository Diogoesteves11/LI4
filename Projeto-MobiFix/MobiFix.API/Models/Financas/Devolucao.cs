namespace MobiFix.API.Models.Financas;

public class Devolucao
{
    public int Id { get; set; }
    public int FaturaID { get; set; }
    public DateTime DataDevolucao { get; set; }
    public string Motivo { get; set; } = string.Empty;
}
