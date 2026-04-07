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
    // ServicoID removido — é gerado pelo Node.js/MongoDB, não pelo cliente
    [Required(ErrorMessage = "O número de série da trotinete é obrigatório.")]
    public string TrotineteNumSerie { get; set; } = string.Empty;

    public string? FeedbackCliente { get; set; }
}