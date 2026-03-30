namespace MobiFix.API.Models.Stocks;

public class Peca
{
    public string Codigo { get; private set; }
    public string Descricao { get; private set; }
    public string Nome { get; private set; } // Mantido do teu código original
    public int Stock { get; private set; }
    public float Pvp { get; private set; }
    public float Custo { get; private set; }
    public int QuantMinima { get; private set; } // Mapeado do teu StockMinimo
    public int PadraoRep { get; private set; }
    public bool Ativo { get; private set; }

    // Construtor corrigido com os tipos corretos (float e int em vez de string)
    public Peca(string codigo, string descricao, string nome, int stock, float pvp, float custo, int quantMinima, int padraoRep) 
    {
        Codigo = codigo;
        Descricao = descricao;
        Nome = nome;
        Stock = stock;
        Pvp = pvp;
        Custo = custo;
        QuantMinima = quantMinima;
        PadraoRep = padraoRep;
        Ativo = true; 
    }

    public bool AjustarStock(int novoStock)
    {
        if (novoStock < 0) return false;
        Stock = novoStock;
        return true;
    }

    public float GetMargem()
    {
        if (Custo == 0) return 100f; 
        return ((Pvp - Custo) / Custo) * 100f; 
    }
}