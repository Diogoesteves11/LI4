namespace MobiFix.API.Models.Stocks;

public class Promocao
{
    public string Id { get; private set; }
    public string Descricao { get; private set; }
    public float PercDesconto { get; private set; }
    public DateTime DataInicio { get; private set; }
    public DateTime DataFim { get; private set; }
    public List<string> PecasIncluidas { get; private set; }

    public Promocao(string id, string descricao, float percDesconto, DateTime inicio, DateTime fim, List<string> pecas)
    {
        Id = id;
        Descricao = descricao;
        PercDesconto = percDesconto;
        DataInicio = inicio;
        DataFim = fim;
        PecasIncluidas = pecas ?? new List<string>();
    }

    public float VerificarPromo(string codigoPeca, DateTime data)
    {
        if (data >= DataInicio && data <= DataFim && PecasIncluidas.Contains(codigoPeca))
        {
            return PercDesconto;
        }
        return 0f;
    }
}