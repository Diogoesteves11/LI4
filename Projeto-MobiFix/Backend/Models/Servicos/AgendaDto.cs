namespace Backend.Models;

using System.ComponentModel.DataAnnotations;

public class AgendaDto
{
    public string AgendaID { get; set; } = string.Empty;
    public string? MecanicoNumero { get; set; }
    public string? ServicoID { get; set; }
    public string TipoSlot { get; set; } = string.Empty; // ex: "Diagnostico", "Reparacao"
    public string? IntervencaoID { get; set; }
    public DateTime DataHoraInicio { get; set; }
    public string Estado { get; set; } = "Agendado";
}

public class AgendaCriacaoDto
{
    [Required]
    public string AgendaID { get; set; } = string.Empty;
    
    public string? MecanicoNumero { get; set; } // Pode ser atribuído depois pelo gestor
    
    [Required]
    public string ServicoID { get; set; } = string.Empty;
    
    [Required]
    public string TipoSlot { get; set; } = "Diagnostico";
    
    public string? IntervencaoID { get; set; }
    
    [Required]
    public DateTime DataHoraInicio { get; set; }
    
    public string Estado { get; set; } = "Agendado";
}