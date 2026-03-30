namespace MobiFix.API.Models.Servicos;

public class AgendaMecanico
{
    public int AgendaID { get; set; }
    public int MecanicoID { get; set; }
    public int ServicoID { get; set; }
    public string TipoSlot { get; set; } = "Diagnostico";
    public int? IntervencaoID { get; set; }
    public DateTime DataHoraInicio { get; set; }
    public string Estado { get; set; } = "Reservado";
}
