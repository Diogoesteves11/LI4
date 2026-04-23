# Diagramas de Classes — Backend MobiFix

Esta pasta contém um diagrama de classes por subsistema, em formato
Mermaid `classDiagram` (`.mmd`). Cada ficheiro é auto-contido e pode
ser importado separadamente no Visual Paradigm Online.

## Ficheiros

| Ficheiro | Subsistema | Nº de classes (aprox) |
|---|---|---|
| `01-autenticacao.mmd` | Autenticação (login/registo/JWT) | 8 |
| `02-utilizadores.mmd` | Clientes e Funcionários | 8 |
| `03-catalogos.mmd` | Peças, Trotinetes, Intervenções | 14 |
| `04-servicos.mmd` | Serviços de reparação + Agenda | 17 |
| `05-stocks.mmd` | Encomendas de reposição de stock | 6 |
| `06-financas.mmd` | Faturas, Vendas, Encomendas Cliente, Estatísticas, Promoções | 30+ |
| `07-email.mmd` | Notificações SMTP (transversal) | 3 |

## Dois formatos disponíveis

Cada subsistema tem **duas versões** com o mesmo conteúdo:

- `*.mmd` — Mermaid (para mermaid.live, draw.io, Markdown preview, GitHub)
- `*.puml` — PlantUML (para Visual Paradigm via `Instant Reverse from PlantUML`)

Os dois são mantidos em sincronia. Escolhe o formato conforme a ferramenta.

## Como importar no Visual Paradigm (PlantUML)

1. Abre o VP (desktop ou Online).
2. Menu **Tools > Code > Instant Reverse from PlantUML** (ou equivalente).
3. Cola o conteúdo do `.puml` ou aponta para o ficheiro.
4. O VP gera um diagrama de classes editável com todas as classes e relações.

Para VP Online: `Diagrams > New > PlantUML Diagram` e cola o conteúdo.

## Como renderizar o Mermaid

- **mermaid.live** — cola o `.mmd` e exporta PNG/SVG para meter no relatório.
- **draw.io** — `Extras > Edit Diagram > Mermaid`, cola o conteúdo.
- **VS Code** — extensão "Markdown Preview Mermaid Support" mostra o diagrama no preview.

## Convenções UML aplicadas

### Visibilidade
- `+` público
- `-` privado
- `#` protegido

### Estereótipos (annotations `<<…>>`)
- `<<controller>>` — controllers ASP.NET (fachada REST)
- `<<interface>>` — interfaces `IXxxService`
- `<<service>>` — implementações dos services
- `<<DTO>>` — Data Transfer Objects (Models/)
- `<<external>>` — classes de outros subsistemas referenciadas aqui para contexto (definição completa no respetivo diagrama)

### Relações
- `..|>` **Realização** (classe implementa interface) — linha tracejada com triângulo oco. Ex.: `AuthService ..|> IAuthService`.
- `..>`  **Dependência** (usa sem possuir) — linha tracejada com seta aberta. Usada para:
  - Injecção de dependências (Controller → Interface)
  - Uso de DTO em assinaturas
- `*--`  **Composição** (parte–todo forte, ciclo de vida partilhado) — linha sólida com losango cheio. Ex.: `ServicoDto *-- IntervencaoRealizadaDto`.
- `-->`  **Associação** (referência entre classes, mesmo por ID) — linha sólida com seta. Ex.: `Faturacao --> FaturaDto`.

### Multiplicidade
Indicada entre aspas junto à extremidade da relação:
- `"1"` — exatamente um
- `"0..1"` — zero ou um (nullable)
- `"1..*"` — um ou mais
- `"0..*"` — zero ou mais (equivalente a `*`)

Exemplo: `ServicoDto *-- "0..*" IntervencaoRealizadaDto : historico`

### Nullability
Seguindo a convenção C# 8+ de *nullable reference types*, parâmetros e
retornos opcionais aparecem com `?` sufixo. Ex.: `Task~string?~`.

## Notas de fidelidade ao código

Estes diagramas refletem **o código atual**, incluindo algumas inconsistências
que talvez queiras corrigir por rename no Visual Studio:

1. **`TrotinetelCriacaoDto`** — typo com `l` a mais. Ver `Models/Catalogos/TrotineteDto.cs:14`.
2. **`IntervencoesCatalogoController`** (classe) vive no ficheiro `IntervencaoCatalogoController.cs` (singular). O nome do ficheiro não bate com o nome da classe.
3. **`PromocoesController`** (classe) vive no ficheiro `PromocaoController.cs`. Mesmo problema.
4. **`GetTrotineteNumeroSerie`** em `ITrotineteService` não tem sufixo `Async` ao contrário dos outros métodos.
5. **`EncomendaStockController`** tem `Route("api/Encomendas")` (não `api/EncomendaStock`), e os `[HttpGet]`/`[HttpPost]` usam `"stock"` / `"stock/{id}"` como prefixo.

## Como interpretar os diagramas

Cada diagrama segue a mesma estrutura vertical:

1. **Controllers** no topo — pontos de entrada HTTP.
2. **Interfaces** no meio — contratos dos services.
3. **Services** abaixo das interfaces — implementações concretas que falam com a Data API Node.
4. **DTOs** em baixo — objetos de transporte, com composições internas onde aplicável.
5. **Externos** à parte — classes/interfaces pertencentes a outros subsistemas, mostradas como stubs para explicitar a dependência sem duplicar conteúdo.

Os DTOs `*CriacaoDto` / `*AtualizacaoDto` são variantes de input, e
`*Dto` é tipicamente a representação completa retornada pela API.
