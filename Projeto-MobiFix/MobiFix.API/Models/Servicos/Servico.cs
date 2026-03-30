namespace MobiFix.API.Models.Servicos;

public class Servico
{
    public int Id { get; set; }
    public int TrotineteID { get; set; }
    public string Estado { get; private set; }
    public DateTime DataAgendamento { get; set; }
    public string? DescricaoDiagnostico { get; set; }
    public string? FeedbackCliente { get; set; }
    public DateTime? DataConclusao { get; set; }
    public decimal Preco { get; set; }

    public Servico(int trotineteId, DateTime dataAgendamento)
    {
        TrotineteID = trotineteId;
        DataAgendamento = dataAgendamento;
        Estado = "Agendado";
        Preco = 0;
    }

    public bool IniciarExecucao()
    {
        if (Estado != "Agendado") return false;
        Estado = "Em Execução";
        return true;
    }

    public bool Concluir()
    {
        if (Estado != "Em Execução") return false;
        Estado = "Concluido";
        DataConclusao = DateTime.UtcNow;
        return true;
    }

    public bool Fechar()
    {
        if (Estado != "Concluido") return false;
        Estado = "Fechado";
        return true;
    }
}
