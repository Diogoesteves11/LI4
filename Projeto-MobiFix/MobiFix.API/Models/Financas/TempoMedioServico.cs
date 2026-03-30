namespace MobiFix.API.Models.Financas;

public class TempoMedioServico
{
    public string DescricaoIntervencao { get; set; } = string.Empty;
    public double MediaMinutos { get; set; }
    public int TotalRealizadas { get; set; }
}
