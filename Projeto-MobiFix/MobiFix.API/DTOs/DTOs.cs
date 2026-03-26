namespace MobiFix.API.DTOs;

public class FuncionarioDto 
{
    public int FuncionarioID { get; set; }
    public string NumeroMecanografico { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Contacto { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
    public bool Ativo { get; set; }
}

public class ClienteDto 
{
    public int ClienteID { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? Morada { get; set; }
    public string NIF { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}


public class TrotineteDto
{
    public int TrotineteID { get; set; }
    public string NumeroSerie { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public bool EmServico { get; set; } = string.Empty;
    public int ClienteID { get; set; }
}

public class PecaDto
{
    public int PecaID { get; set; }
    public string CodigoEAN { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal CustoAquisicao { get; set; }
    public decimal PVP { get; set; }
    public int StockAtual { get; set; }
    public int StockMinimo { get; set; }
    public int PadraoReposicao { get; set; }
    public bool Ativo { get; set; }
}


public class ServicoDto
{
    public int ServicoID { get; set; }
    public int TrotineteID { get; set; }
    public string Estado { get; set; } = "Agendado";
    public DateTime DataAgendamento { get; set; }
    public string? DescricaoDiagnostico { get; set; }
    public string? FeedbackCliente { get; set; }
    public DateTime? DataConclusao { get; set; }
    public decimal Preco { get; set; }
}

public class IntervencaoCatalogoDto
{
    public int IntervencaoID { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal PrecoFixoMaoDeObra { get; set; }
    public string Especialidade { get; set; } = string.Empty;
}

public class ServicoIntervencaoDto
{
    public int ServicoID { get; set; }
    public int IntervencaoID { get; set; }
    public int MecanicoID { get; set; }
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public int? TempoGastoMinutos { get; set; } 
}

public class IntervencaoPecaDto
{
    public int ServicoID { get; set; }
    public int IntervencaoID { get; set; }
    public int PecaID { get; set; }
    public int Quantidade { get; set; }
}


public class VendaDto
{
    public int VendaID { get; set; }
    public int OperadorID { get; set; }
    public DateTime DataVenda { get; set; }
    public decimal Total { get; set; }
}

public class FaturaDto
{
    public int FaturaID { get; set; }
    public string NumeroFatura { get; set; } = string.Empty;
    public DateTime DataEmissao { get; set; }
    public int ClienteID { get; set; }
    public int? ServicoID { get; set; }
    public int? VendaID { get; set; }
    public decimal ValorTotal { get; set; }
    public string MetodoPagamento { get; set; } = string.Empty;
}

public class DevolucaoDto
{
    public int DevolucaoID { get; set; }
    public int FaturaID { get; set; }
    public DateTime DataDevolucao { get; set; }
    public string Motivo { get; set; } = string.Empty;
}

public class NotaCreditoDto
{
    public int NotaCreditoID { get; set; }
    public int DevolucaoID { get; set; }
    public decimal ValorCreditado { get; set; }
}

public class PromocaoDto
{
    public int PromocaoID { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal PercentagemDesconto { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public int AdministradorID { get; set; }
}

public class PromocaoPecaDto
{
    public int PromocaoID { get; set; }
    public int PecaID { get; set; }
}

public class EncomendaClienteDto
{
    public int EncomendaClienteID { get; set; }
    public int ClienteID { get; set; }
    public DateTime DataEncomenda { get; set; }
    public string Estado { get; set; } = "Pronto para Levantamento";
    public decimal Total { get; set; }
    public int? FaturaID { get; set; }
}

public class EncomendaClienteItemDto
{
    public int EncomendaClienteID { get; set; }
    public int PecaID { get; set; }
    public int Quantidade { get; set; }
}

public class EncomendaStockDto
{
    public int EncomendaID { get; set; }
    public int PecaID { get; set; }
    public int Quantidade { get; set; }
    public string Estado { get; set; } = "Pendente";
    public DateTime DataPedido { get; set; }
    public int? OperadorRececaoID { get; set; }
    public int? AdminValidadorID { get; set; }
}