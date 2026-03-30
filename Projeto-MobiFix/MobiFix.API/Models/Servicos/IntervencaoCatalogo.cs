namespace MobiFix.API.Models.Servicos;

public class IntervencaoCatalogo
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal PrecoFixoMaoDeObra { get; set; }
    public string Especialidade { get; set; } = string.Empty;
}
