namespace Backend.Services;

using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// DelegatingHandler que lê o token JWT do HttpContext atual (enviado pelo frontend)
/// e o propaga no header Authorization de cada pedido HTTP feito à Data API.
/// Deve ser registado em todos os HttpClients excepto o do PecaService.
/// </summary>
public class JwtPropagationHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public JwtPropagationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var httpContext = _httpContextAccessor.HttpContext;

        if (httpContext is not null)
        {
            // Lê o header Authorization do pedido original vindo do frontend
            var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(authHeader) &&
                authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader["Bearer ".Length..].Trim();
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
        }

        return base.SendAsync(request, cancellationToken);
    }
}
