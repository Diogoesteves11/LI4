namespace Backend.Models;

public class PecaDto
{
    public string CodigoEAN { get; set; }
    public string Descricao { get; set; }
    public string Categoria { get; set; }
    public string Nome { get; set; }
    public int Stock { get; set; }
    public float PVP { get; set; }
    public float CustoAquisicao { get; set; }
    public int QuantidadeMinima { get; set; } 
    public int PadraoReposicao { get; set; }
    public bool Ativo { get; set; }
}