namespace MobiFix.API.Models.Financas;

public class ItemInventario
{
    public string CodigoEAN { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int StockAtual { get; set; }
    public int StockMinimo { get; set; }
    public decimal PVP { get; set; }
    public decimal CustoAquisicao { get; set; }
    public decimal ValorEmStock => StockAtual * CustoAquisicao;
}
