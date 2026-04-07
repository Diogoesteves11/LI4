namespace Backend.Models;

using System.ComponentModel.DataAnnotations;

public class ServicoDto
{
    public int ServicoID { get; set; }
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
    public int IntervencaoCatalogoID { get; set; } 
    public string MecanicoNumero { get; set; } = string.Empty;
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
    public int ServicoID { get; set; } 
    [Required]
    public string TrotineteNumSerie { get; set; } = string.Empty;
    public string Estado { get; set; } = "Pendente";
    public string DescricaoDiagnostico { get; set; } = "Diagnóstico inicial agendado.";
    public decimal Preco { get; set; }
    // ID "3" fixo para a intervenção de catálogo de diagnóstico
    public int IntervencaoInicialID { get; set; } = 3;
}