namespace MobiFix.API.Models.Stocks;

public class EncomendaStock
{
    public string Id { get; private set; }
    public string Estado { get; private set; }
    public DateTime DataCriacao { get; private set; }
    public DateTime? DataRececao { get; private set; }
    public int Quantidade { get; private set; }
    public string CodPeca { get; private set; }
    public string IdAdmin { get; private set; }
    public string? IdRececao { get; private set; }

    public EncomendaStock(string id, string idAdmin, string codPeca, DateTime dataCriacao)
    {
        Id = id;
        IdAdmin = idAdmin;
        CodPeca = codPeca;
        DataCriacao = dataCriacao;
        Estado = "Pendente";
    }

    public bool RececionarEncomenda(string codRec)
    {
        if (Estado == "Rececionada") return false;
        
        Estado = "Rececionada";
        IdRececao = codRec;
        DataRececao = DateTime.Now;
        return true;
    }

    public bool EditarQuantidade(int novaQuantidade)
    {
        if (Estado != "Pendente" || novaQuantidade <= 0) return false;
        
        Quantidade = novaQuantidade;
        return true;
    }
}