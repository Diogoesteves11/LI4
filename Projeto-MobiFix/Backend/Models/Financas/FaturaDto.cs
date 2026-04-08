namespace Backend.Models;

using System.ComponentModel.DataAnnotations;

public class FaturaDto
{
    public string NumeroFatura { get; set; } = string.Empty;
    public string ClienteNIF { get; set; } = string.Empty;
    public string? ServicoID { get; set; }
    public string? VendaID { get; set; }
    public decimal ValorTotal { get; set; }
    public string MetodoPagamento { get; set; } = string.Empty;
    public DateTime DataEmissao { get; set; }
    public List<DevolucaoDto> Devolucoes { get; set; } = new();
}

public class DevolucaoDto
{
    public string? DevolucaoID { get; set; }
    public DateTime? DataDevolucao { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public NotaCreditoDto? NotaCredito { get; set; }
}

public class NotaCreditoDto
{
    public decimal ValorCreditado { get; set; }
}

public class FaturaCriacaoDto
{
    [Required]
    public string NumeroFatura { get; set; } = string.Empty;
    [Required]
    public string ClienteNIF { get; set; } = string.Empty;
    public string? ServicoID { get; set; }
    [Range(0.01, double.MaxValue)]
    public decimal ValorTotal { get; set; }
    [Required]
    public string MetodoPagamento { get; set; } = string.Empty;
}