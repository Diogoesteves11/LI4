namespace Backend.Models;

public class IntervencaoCatalogoDto
{
    public int IntervencaoID { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal PrecoFixoMaoDeObra { get; set; }
    public string Especialidade { get; set; } = string.Empty;
}