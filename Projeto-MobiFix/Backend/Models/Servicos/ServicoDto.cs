namespace Backend.Models;

using System.ComponentModel.DataAnnotations;

public class ServicoDto
{
    public string ServicoID { get; set; } = string.Empty;
    public string TrotineteNumSerie { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime DataAgendamento { get; set; }
    public string? DescricaoDiagnostico { get; set; }
    public string? FeedbackCliente { get; set; }
    public DateTime? DataConclusao { get; set; }
    public decimal Preco { get; set; }
    public List<IntervencaoRealizadaDto> HistoricoIntervencoes { get; set; } = new();
}

public class IntervencaoRealizadaDto
{
    public string IntervencaoCatalogoID { get; set; } = string.Empty;
    public string? MecanicoNumero { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public int? TempoGastoMinutos { get; set; }
    public List<PecaUtilizadaDto> PecasUtilizadas { get; set; } = new();
}

public class PecaUtilizadaDto
{
    public string PecaEAN { get; set; } = string.Empty;
    public int Quantidade { get; set; }
}

public class ServicoCriacaoDto
{
    [Required]
    public string ServicoID { get; set; } = string.Empty;
    [Required]
    public string TrotineteNumSerie { get; set; } = string.Empty;
    public string Estado { get; set; } = "Pendente";
    public string DescricaoDiagnostico { get; set; } = "Diagnóstico inicial agendado.";
    public decimal Preco { get; set; }
    // ID "3" fixo para a intervenção de catálogo de diagnóstico
    public string IntervencaoInicialID { get; set; } = "3";
}