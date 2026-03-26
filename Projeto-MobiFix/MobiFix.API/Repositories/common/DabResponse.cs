using System.Text.Json.Serialization;

namespace MobiFix.API.Repositories;

public class DabResponse<T>
{
    [JsonPropertyName("value")]
    public List<T> Value { get; set; } = new();

    [JsonPropertyName("nextLink")]
    public string? NextLink { get; set; }
}