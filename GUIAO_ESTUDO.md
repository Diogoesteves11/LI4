# Guião de Estudo — Fix'n'Ride / MobiFix

> Documento de apoio à **apresentação oral** do projeto da UC de Laboratórios de Informática IV (2025/2026).
> Foco: ciclo completo de Engenharia de Software com Inteligência Artificial Generativa como ferramenta de apoio.
> Equipa: Diogo Esteves (A104004), Diogo Fernandes (A104260), Jorge Fernandes (A104168), Rodrigo Fernandes (A104175).

---

## Índice

1. [Visão Geral — O que é o Fix'n'Ride](#1-visão-geral)
2. [Fase 1 — Conceção e Engenharia de Requisitos](#2-fase-1--conceção-e-engenharia-de-requisitos)
3. [Fase 2 — Arquitetura e Design](#3-fase-2--arquitetura-e-design)
4. [Camada de Dados — MongoDB + Mongoose](#4-camada-de-dados)
5. [Camada de Lógica de Negócios — ASP.NET Core](#5-camada-de-lógica-de-negócios)
6. [Camada de Apresentação — React + TanStack Query](#6-camada-de-apresentação)
7. [Pipelines Operacionais — Fluxos End-to-End](#7-pipelines-operacionais)
8. [Geração de Código com LLMs — Metodologia](#8-geração-de-código-com-llms)
9. [Verificação, Validação e Qualidade (ISO/IEC 25010)](#9-verificação-validação-e-qualidade)
10. [Trabalho Futuro e Lições Aprendidas](#10-trabalho-futuro-e-lições)
11. [Perguntas de Exame ao nível de Júri Universitário](#11-perguntas-de-exame)

---

## 1. Visão Geral

### 1.1. Caso de estudo
**MobiFix — Mobility Repair Services**: oficina multimarca de **trotinetes elétricas** (Xiaomi, Segway, Ninebot), inspirada num modelo retalhista tipo Norauto, adaptado ao contexto da micromobilidade urbana. O negócio cresce, mas o stack atual depende de **folhas de cálculo e papel**, o que provoca:

- Imobilização de capital em peças paradas vs. ruturas de stock críticas.
- Diagnósticos lentos por ausência de histórico digital.
- Cliente sem visibilidade do estado da reparação ⇒ chamadas telefónicas constantes.
- Impossibilidade de calcular rentabilidade por serviço/peça.

### 1.2. O sistema Fix'n'Ride
Plataforma **Web SPA multi-perfil** que digitaliza **todo** o ciclo de vida operacional: agendamento → diagnóstico → reparação → faturação → entrega; venda direta ao balcão; click & collect; gestão de stock com reposição automática; dashboard de KPIs.

Quatro **portais** com bases de URL distintas e mesma SPA:
| Portal | Rota base | Persona |
|---|---|---|
| Cliente | `/FixNRide/*` | Cliente final |
| Operador | `/FixNSell/*` | Operador de loja (João) |
| Mecânico | `/FixNRepair/*` | Mecânico de bancada (Pedro) |
| Administrador | `/FixNManage/*` (+ FixNSell + FixNRepair) | Administradora (Ana) |

### 1.3. Stack
- **MongoDB 7** + **Mongoose** — persistência NoSQL orientada a documentos.
- **Node.js 22 + Express** — Data API (CRUD direto sobre MongoDB).
- **ASP.NET Core .NET 8 (C#)** — Lógica de Negócios (JWT, BCrypt, orquestração).
- **React 18 + Vite + React Router v6 + TanStack Query + Tailwind CSS** — Frontend SPA.
- **Docker + Docker Compose** — orquestração de 4 contentores numa rede bridge.

### 1.4. Slogan da apresentação
> *"Substituir o ecossistema fragmentado por uma **Single Source of Truth**, usando IA como amplificador da equipa — nunca como substituto."*

---

## 2. Fase 1 — Conceção e Engenharia de Requisitos

### 2.1. Stakeholders identificados
| Stakeholder | Foco | Necessidade-chave |
|---|---|---|
| **Administração** (Ana) | Rentabilidade, métricas | Alertas de reposição, KPIs, aprovação de encomendas |
| **Mecânicos** (Pedro) | Produtividade técnica | Tablet na bancada, catálogo, registo rápido |
| **Operador de loja** (João) | Atendimento rápido | Venda direta, lista de prontos para levantamento |
| **Cliente** | Transparência | Agendamento online, estado em tempo real, faturas em PDF |

### 2.2. Métodos de levantamento (abordagem mista)
1. **Questionários de formato livre** a operadores, mecânicos e clientes.
2. **Observação direta** dos fluxos físicos.
3. **Entrevistas estruturadas** (exceto clientes), realizadas com a Ana, João e Pedro.

> **Princípio metodológico crítico:** as LLMs **não identificaram requisitos** — apenas ajudaram a **redigir** entrevistas, user stories e secções narrativas. O levantamento é trabalho humano, baseado no estudo de Norauto e outras oficinas.

### 2.3. User Stories (15 narrativas chave)
Cobrem 6 áreas: Gestão de Oficina, Stock e Compras, Administração e Faturação, Conta e Veículos, Agendamento, Compras e Documentação.

### 2.4. Requisitos Funcionais — Lista completa (22)
| # | Requisito | Área |
|---|---|---|
| RF01 | Registo do cliente (NIF, email, morada, password) | Autenticação |
| RF02 | Login de utilizador (NIF + password) | Autenticação |
| RF03 | Registo de nova trotinete (série, marca, modelo) | Catálogos |
| RF04 | Reserva de peças pelo cliente (Click & Collect) | Finanças |
| RF05 | Marcação de ato de diagnóstico | Serviços |
| RF06 | Histórico de faturas e reparações | Finanças/Serviços |
| RF07 | Login de funcionário (nº mecanográfico) | Autenticação |
| RF08 | Listar stock de peças | Stocks |
| RF09 | Gerir promoções (criar, ativar, datas, peças aplicáveis) | Finanças |
| RF10 | Editar catálogo de peças | Catálogos |
| RF11 | Editar catálogo de intervenções | Catálogos |
| RF12 | Aprovar ordens de encomenda pendentes / histórico | Stocks |
| RF13 | Consultar dados operacionais (Dashboard) | Finanças |
| RF14 | Registo de novo funcionário com perfil RBAC | Utilizadores |
| RF15 | Preencher guia de reparação (PDF) | Serviços |
| RF16 | Registo do código EAN da peça utilizada | Serviços/Catálogos |
| RF17 | Alteração automática do estado da reparação | Serviços |
| RF18 | Receção física de encomenda de stock | Stocks |
| RF19 | Registo de venda direta ao balcão e faturação | Finanças |
| RF20 | Entrega de encomenda a cliente (click & collect) | Stocks |
| RF21 | Levantamento de trotinete + pagamento (via NIF) | Serviços |
| RF22 | Processar devolução (nota de crédito) | Serviços/Stocks |

### 2.5. Requisitos Não Funcionais (5)
| # | RNF | Tipo | Métrica |
|---|---|---|---|
| RNF1 | Tempo de resposta < 2 s em leituras | Desempenho | P95 |
| RNF2 | Interface responsiva (desktop + tablet) | Usabilidade / I/O | Tailwind |
| RNF3 | Validação de inputs e robustez a falhas | Fiabilidade | Boas práticas |
| RNF4 | Stack obrigatória: React + .NET + MongoDB | Restrição | Arquitetural |
| RNF5 | RBAC + hashing de credenciais (BCrypt) | Segurança | OWASP |

### 2.6. Refinamento de requisitos ambíguos
Exemplo de transformação:
- *"O sistema deve ser rápido"* → **"Tempo de resposta < 2 s para leituras (RNF1)"**.
- *"Controlar melhor o stock"* → **"Geração automática de encomenda PENDENTE ao atingir stockMinimo (RF12)"**.
- *"Permitir vender peças"* → **"Diferenciação Peça (com stock) vs. Serviço (intervenção)"**.

### 2.7. Modelo de Domínio (entidades e relações)
**Entidades centrais:** Cliente, Trotinete, Serviço de Reparação, Intervenção, Venda, Peça, Fatura, Nota de Crédito, Devolução, Encomenda de Peças, Guia de Reparação, Funcionário (Operador, Mecânico, Administrador).

**Cardinalidades-chave** (decoram-se):
- Cliente 1:0..* Trotinete
- Trotinete 1:0..* Serviço
- Serviço 1:1..* Intervenção (composição)
- Intervenção 1:0..* Peça (utiliza)
- Venda 1:1 Fatura
- Devolução 0..*:1 Fatura, 1:1 Nota de Crédito
- Operador 1..*:0..* Venda

### 2.8. Casos de Uso — total: 26 (UC01 a UC26)
Distribuídos por **6 diagramas**: Global, Cliente, Funcionário (genérico), Administrador, Operador de Loja, Mecânico. Uso de **generalização** para herança entre `Funcionário` → {Admin, Operador, Mecânico}.

UCs críticos para a apresentação:
- **UC01** Agendamento de diagnóstico
- **UC02** Venda direta ao balcão (com fluxo alternativo: geração de encomenda automática)
- **UC03** Aprovar encomenda de reposição
- **UC04** Faturar serviço e entregar trotinete (UC mais complexo — orquestração atómica)
- **UC05** Consultar dashboard
- **UC21** Alterar estado da intervenção (atualiza média de tempos estimados)

---

## 3. Fase 2 — Arquitetura e Design

### 3.1. Decisão arquitetural global: **Multi-Tier com 4 contentores Docker**
```
┌──────────────┐    HTTP/JSON     ┌────────────┐  HTTP+x-api-key  ┌──────────┐  driver   ┌─────────┐
│  Frontend    │ ───────────────▶ │     LN     │ ────────────────▶│ Data API │ ────────▶ │ MongoDB │
│ React (3000) │   JWT no cookie  │ .NET (5001)│  INTERNAL_API_KEY│ Node 3001│           │  27017  │
└──────────────┘                  └────────────┘                  └──────────┘           └─────────┘
```
- O **Frontend** apenas conhece o servidor LN.
- A **Data API** **nunca** está exposta ao exterior; só o serviço LN da rede Docker interna lhe pode chamar (autenticação por `x-api-key`).
- **MongoDB** sem porta exposta; apenas a Data API o acede.

### 3.2. Padrão arquitetural transversal: **MVC modular por domínio**
| Componente | Papel |
|---|---|
| **Controllers** (.NET / Express) | Recebem HTTP, sem lógica de negócio |
| **Services** (.NET) / Controllers de domínio (Express) | Encapsulam regras de negócio |
| **DTOs / Schemas Mongoose** | Contratos de dados |

### 3.3. Justificação da Stack (decora!)
| Tecnologia | Camada | Razão |
|---|---|---|
| **MongoDB + Mongoose** | Persistência | Entidades hierárquicas (Servico ⊃ historicoIntervencoes ⊃ pecasUtilizadas, Fatura ⊃ devolucoes). Evita JOINs. Validação declarativa. |
| **Node.js + Express** | Data API | Afinidade JSON↔BSON, I/O não-bloqueante, ecossistema npm (`mongoose`, `jsonwebtoken`, `morgan`) |
| **ASP.NET Core .NET 8** | Lógica de Negócios | Tipagem estática, DI nativo, Swagger automático, BCrypt/JWT robustos |
| **React + TanStack Query** | Frontend | Componentes reutilizáveis + cache automático + sincronização servidor↔cliente |
| **Tailwind CSS** | Estilização | Utility-first, sem CSS global, purging automático |
| **Docker + Compose** | Orquestração | Portabilidade, isolamento, rede privada, fail-fast em variáveis ausentes |

### 3.4. Docker — Topologia (decora a cadeia)
**Cadeia de dependências:** `mongodb → data-api → ln → frontend`

| Serviço | Porta exposta | Volume / Comando | Depende de |
|---|---|---|---|
| `mongodb` | — (interna) | Volume `mongodb_data` + `init.sh` (importa 12 colecções + cria índices) | — |
| `data-api` | `${DATA_API_PORT}:3001` | — | mongodb |
| `ln` | `${LN_API_PORT}:5001` | Swagger UI em dev | data-api |
| `frontend` | `3000:3000` | bind mount `./Frontend:/app` + `npm install && npm run dev` | ln |

### 3.5. Variáveis de ambiente críticas (`.env`, fora do Git)
- `MONGO_URI=mongodb://mongodb:27017/fixnride_db`
- `INTERNAL_API_KEY` — partilhada entre LN e Data API; **autentica a comunicação inter-serviços**
- `JwtSettings__SecretKey` — chave HMAC-SHA256 para JWT
- `DataApiSettings__BaseUrl=http://data-api:3001`
- `ASPNETCORE_ENVIRONMENT=Development`
- `CHOKIDAR_USEPOLLING=true` — necessário para hot-reload no Vite dentro de Docker em macOS/Windows

### 3.6. Princípios condutores
- **Separation of Concerns** entre camadas
- **Twelve-Factor App** (configurações externalizadas em `.env`)
- **Infrastructure as Code** (`docker compose up --build` reconstrói tudo)
- **Fail-fast** em arranque (lança exceção se variáveis essenciais estiverem ausentes)

---

## 4. Camada de Dados

### 4.1. Por que MongoDB?
Três fatores **decisórios** (decorar):
1. **Natureza hierárquica e agregada** — `Servico` agrega array de `historicoIntervencoes`, cada um com `pecasUtilizadas`. Em SQL exigiria ≥3 tabelas e JOINs. Em MongoDB é **um documento, uma leitura atómica**.
2. **Flexibilidade de schema** — `Fatura` pode ganhar subdocumentos de `devolucoes` sem migração que bloqueie produção.
3. **Performance** — colocação de dados no mesmo documento elimina round-trips.

### 4.2. Estratégias: Embedding vs. Referencing
**Critérios de decisão:** frequência de acesso conjunto, cardinalidade limitada, dependência de existência.

| Embedding (subdocumentos) | Referencing (`ref` Mongoose) |
|---|---|
| `Fatura ⊃ devolucoes` (nota de crédito embutida) | `Trotinete → Cliente` |
| `Servico ⊃ historicoIntervencoes ⊃ pecasUtilizadas` (2 níveis) | `Servico → Trotinete` |
| `Venda ⊃ itensVenda` | `Fatura → Cliente / Servico / Venda` |
| `EncomendaCliente ⊃ itens` | `Agenda → Funcionario / Servico` |
| `Promocao ⊃ pecasAplicaveisIds` | |

> **Delta de IA aqui** — o modelo propunha normalizar **demasiado** (intervenções como coleção separada). A equipa **impôs explicitamente os critérios** no prompt para corrigir.

### 4.3. As 12 colecções MongoDB (`init.sh` faz seed)
1. `funcionarios` — `{_id: ADM001, email, contacto, cargo: enum, especialidade, passwordHash, ativo}`
2. `clientes` — `{_id: NIF, nome, telefone, morada?, email, passwordHash}`
3. `trotinetes` — `{_id: numSerie, marca, modelo, emServico, clienteId}`
4. `servicos` — `{_id, trotineteId, estado: AGENDADO|EXECUCAO|CONCLUIDO|FECHADO, dataAgendamento, descricaoDiagnostico, feedbackCliente, dataConclusao, preco, historicoIntervencoes[]}`
5. `agenda` — `{_id, mecanicoId, servicoId, tipoSlot: DIAGNÓSTICO|REPARACAO, intervencaoId?, dataHoraInicio, estado: RESERVADO|CONCLUIDO}`
6. `intervencoes_catalogo` — `{_id, descricao, precoFixoMaoDeObra, especialidade}`
7. `faturas` — `{_id: FT-XXXXXX, clienteId, servicoId?|vendaId?, valorTotal, metodoPagamento: MBWAY|MULTIBANCO|NUMERARIO, dataEmissao, devolucoes[]}`
8. `vendas` — `{_id, operadorId, dataVenda, total, itensVenda[]}`
9. `promocoes` — `{_id, descricao, percentagemDesconto, dataInicio, dataFim, administradorId, ativa, pecasAplicaveisIds[]}`
10. `pecas` — `{_id: EAN, nome, descricao?, categoria?, custoAquisicao, pvp, stockAtual, stockMinimo, padraoReposicao, imagem?, ativo}`
11. `encomendas_stock` — `{_id, pecaId, quantidade, estado: PENDENTE|TRANSITO|RECECIONADA, dataPedido, operadorRececaoId?, adminValidadorId?}`
12. `encomendas_cliente` — `{_id, clienteId, dataEncomenda, estado: PRONTO PARA LEVANTAMENTO|ENTREGUE, total, faturaId?, itens[]}`

### 4.4. Índices criados em `init.sh`
- `funcionarios.email`, `clientes.email` → **unique**
- `trotinetes.clienteId`, `servicos.trotineteId`, `servicos.estado`, `faturas.clienteId`
- `agenda` composto: `{mecanicoId: 1, dataHoraInicio: 1}` (filtros frequentes)

---

## 5. Camada de Lógica de Negócios

### 5.1. Por que separar **Data API** (Node) e **Lógica de Negócios** (.NET)? — 4 razões
1. **Complexidade de regras de negócio** — orquestrações atómicas (ex: levantamento de trotinete: consulta serviço → identifica cliente → emite fatura → fecha serviço) **não podem estar no frontend** por segurança.
2. **Segurança centralizada** — só o LN emite tokens JWT; BCrypt e HMAC-SHA256 vivem num ambiente fortemente tipado (.NET).
3. **Escalabilidade independente** — LN pode replicar sem replicar a Data API.
4. **Adequação tecnológica** — .NET 8 para lógica complexa, Node.js para gateway leve de dados.

### 5.2. Organização modular — **7 subsistemas**
| Subsistema | Services principais |
|---|---|
| Autenticação | `AuthService`, `TokenListService` (singleton com whitelist/blacklist) |
| Utilizadores | `FuncionarioService`, `TrotineteService`, `ClienteService` |
| Catálogos | `PecaService`, `IntervencaoCatalogoService` |
| Serviços | `ServicoService`, `AgendaService` |
| Financeiro | `VendaService`, `FaturaService`, `EncomendaClienteService`, `PromocaoService`, `EstatisticasService` |
| Stocks | `EncomendaStockService` |
| Email | `EmailService` (assíncrono, isolado para não bloquear fluxo principal) |

Cada serviço é definido por **interface (`I*`)** + implementação concreta, registadas via `AddHttpClient<TInterface, TImplementation>` no `Program.cs`.

### 5.3. Comunicação HTTP com a Data API (**padrão a decorar**)
**`ConfigureDefaultClient`** (no `Program.cs`) configura **todos** os clientes HTTP:
- `BaseAddress = DATA_API_URL` (lançar exceção se ausente — *fail-fast*)
- Header `x-api-key: ${INTERNAL_API_KEY}` adicionado automaticamente
- Métodos de extensão: `GetFromJsonAsync`, `PostAsJsonAsync`, `PutAsJsonAsync`, `DeleteAsync`
- `PropertyNamingPolicy = null` para preservar **PascalCase** (compat com C#/.NET)

**Resiliência:** cada chamada é encapsulada em `IsSuccessStatusCode`; em falha devolve `null` ou colecção vazia ⇒ Controller traduz em 404/400.

**Orquestração paralela:** `EncomendaClienteService` usa `Task.WhenAll` para chamadas paralelas a múltiplas colecções.

**Propagação de JWT:** `JwtPropagationHandler` (DelegatingHandler) anexa o token do utilizador autenticado ao header `Authorization` quando o LN chama a Data API (exceto `PecaService.GET` que é público).

### 5.4. Segurança — Fluxo JWT (**7 passos, decora**)
1. **Submissão de credenciais** — `POST /api/Auth/login/funcionario|cliente`.
2. **Recuperação na Data API** — `AuthService` invoca rotas protegidas com `INTERNAL_API_KEY`.
3. **Verificação BCrypt** — `BCrypt.Net.BCrypt.Verify`; falha ⇒ HTTP 401.
4. **Geração JWT** — assinado HMAC-SHA256 com `JwtSettings__SecretKey`. Validade 8 h. Claims: `jti` (UUID v4), `id`, `nome`, `cargo` (e `email` para cliente).
5. **Emissão de cookie + whitelist** — cookie `mobifix_auth` `HttpOnly`, `SameSite=Strict`, `Secure` (HTTPS). `jti` registado em `TokenListService.Whitelist(jti, exp)`. Token também devolvido em JSON `{ token }`.
6. **Validação contínua** — middleware `JwtBearer`:
   - `OnMessageReceived` lê cookie se header `Authorization` ausente.
   - `OnTokenValidated` consulta `IsAllowed(jti)` em `TokenListService`; falha ⇒ 401.
7. **Logout** — `POST /api/Auth/logout` extrai `jti`, chama `Revoke(jti)` (move de whitelist para blacklist), apaga cookie. Frontend limpa cache TanStack Query (`queryClient.clear()`).

### 5.5. `TokenListService` (singleton, in-memory)
- **Whitelist**: `ConcurrentDictionary<jti, exp>` — só tokens cujo `jti` esteja aqui passam.
- **Blacklist**: tokens revogados via logout — rejeitados mesmo com assinatura válida.
- **`TryCleanup`** a cada 10 min remove entradas expiradas (evita crescimento ilimitado).
- **Limitação:** in-memory ⇒ perdida em restart e não partilhada em múltiplas réplicas. Trabalho futuro: Redis.

### 5.6. RBAC — 4 perfis + módulos
| Perfil | Módulo SPA | Permissões |
|---|---|---|
| **Público** | `/`, `/auth`, `/staff` | Landing + login |
| **CLIENTE** | `/FixNRide/*` | Trotinetes, agendamento, faturas, catálogo, click & collect |
| **OPERADOR** | `/FixNSell/*` | Venda direta, entregas, receção encomendas, faturas emitidas |
| **MECANICO** | `/FixNRepair/*` | Agenda, intervenções, estado de serviços |
| **ADMINISTRADOR** | `/FixNManage/*` + acesso a `/FixNSell` + `/FixNRepair` | Tudo: utilizadores, promoções, encomendas, catálogo, dashboard |

**Implementação:**
- **Backend:** políticas em `Program.cs` (`ApenasAdmin`, `AdminOuOperador`, `AdminOuMecanico`, `TodosAutenticados`) verificadas via `[Authorize(Policy="...")]` ou `[Authorize(Roles="...")]`.
- **Frontend:** componente `ProtectedRoute` (em `AppRouter.jsx`) verifica token e `cargo` contra `allowedRoles`; redireciona para `/auth`.

### 5.7. Endpoints (**inventário a memorizar — secções críticas**)
- **Auth (público):** `POST /api/Auth/login/funcionario`, `POST /api/Auth/login/cliente`, `POST /api/Auth/register/cliente`. **Protegido:** `POST /api/Auth/logout`.
- **Serviços:** `GET /api/Servicos`, `POST`, `PUT /{id}`, `GET /prontas` (trotinetes CONCLUIDO), `PUT /{id}/levantar` (**fluxo atómico**), `PUT /{id}/fechar`.
- **Agenda:** CRUD com filtro `?mecanicoId=&dataHoraInicio=`.
- **Vendas:** `POST /api/Vendas/direta` (recálculo no servidor).
- **Faturas:** `GET /{numero}`, `POST /devolucao/{numero}` (embute subdocumento).
- **EncomendaCliente:** `POST` (cria), `GET /prontas` (Task.WhenAll), `PUT /{id}/levantar`.
- **Estatísticas:** `GET /`, `GET /dia?dia=`, `GET /intervalo?inicio=&fim=`.
- **EncomendaStock:** `POST` (PENDENTE), `PUT /{id}` (transita PENDENTE→TRANSITO→RECECIONADA; ao RECECIONADA incrementa `stockAtual` na Data API).

---

## 6. Camada de Apresentação

### 6.1. SPA com React Router v6 + **Rotas Aninhadas + `<Outlet />`**
- **`AppRouter.jsx`** (em `src/router/`) é o ponto de entrada — envolve tudo num `BrowserRouter`.
- Cada portal tem **layout pai** (sidebar/header/footer) que renderiza `<Outlet />`.
- **`ProtectedRoute`** atua como *guard*: verifica token + `cargo` ∈ `allowedRoles`; redireciona para `/auth`.
- **`api.js`** (Axios) centraliza `baseURL = http://localhost:5001/api` + interceptor que injeta `Authorization: Bearer ${token}` automaticamente.

### 6.2. Mapeamento de rotas (decorar prefixos por perfil)
| Perfil | Rotas |
|---|---|
| Público | `/`, `/auth`, `/staff`, `*` (wildcard ⇒ `/`) |
| Cliente | `/FixNRide/`, `/trotinetes`, `/faturas`, `/agendar`, `/catalogo` |
| Operador | `/FixNSell/vendadireta`, `/trotinetes-prontas`, `/pecas-reservadas`, `/rececao-encomendas`, `/faturas` |
| Mecânico | `/FixNRepair/diagnosticos`, `/reparacoes` |
| Admin | `/FixNManage/dashboard`, `/encomendas`, `/users`, `/promocoes`, `/pecas` |

### 6.3. Camada de Serviços + Camada de Hooks (decora)
**Duas camadas independentes:**
1. **`src/services/*.js`** — funções puras Axios (sem estado).
2. **`src/hooks/use*.js`** — encapsulam `useQuery` (leitura) e `useMutation` (escrita).

**Padrões de cache TanStack Query:**
- `staleTime: 1` (peças, promoções) — sempre revalidar.
- `staleTime: 30000` (operador catálogo) — 30 s.
- `staleTime: 1000*60*5` (faturas) — 5 min.

**Após mutação:**
- `onSuccess` → `queryClient.invalidateQueries([queryKey])`.
- Atualização **otimista** (ex: lista de serviços do mecânico) — `queryClient.setQueryData` substitui imediatamente, sem esperar novo fetch.

### 6.4. Tailwind CSS — Identidade visual por portal
| Portal | Linguagem visual |
|---|---|
| Cliente | Mobile-first, azuis/roxos, cards arredondados, **BottomNav** |
| Operador/Admin | Desktop-first, **sidebar lateral fixa** |
| Mecânico | Denso em informação, **cartões + painel lateral lado a lado** |

### 6.5. Processo de design assistido por IA
1. Wireframe com **Figma + Figma AI (First Draft)** a partir de prompt textual.
2. Refinamento manual no Figma (paleta, tipografia, hierarquia).
3. Mockup HiFi exportado.
4. **Antigravity (Google DeepMind)** gera código React/Tailwind a partir da imagem + descrição.

---

## 7. Pipelines Operacionais

> **Decora estes pipelines.** São o coração da apresentação técnica.

### 7.1. Pipeline P1 — Registo + Login de Cliente
```
[Browser] ── POST /api/Auth/register/cliente ──▶ [LN AuthController]
                                                       │
                                          BCrypt.HashPassword(password)
                                                       │
                                                       ▼
                                    POST /api/clientes (x-api-key) ──▶ [Data API]
                                                                              │
                                                                              ▼
                                                                         [MongoDB]

[Browser] ── POST /api/Auth/login/cliente {NIF, password} ──▶ [LN AuthController]
                                                                     │
                              GET /api/clientes/{NIF} (x-api-key) ──▶ [Data API] ──▶ MongoDB
                                                                     ◀── doc com passwordHash
                                                                     │
                                                BCrypt.Verify(password, hash)
                                                                     │
                                                Gera JWT (HMAC-SHA256, 8h, jti, cargo=Cliente)
                                                                     │
                                          TokenListService.Whitelist(jti, exp)
                                                                     │
                                          Set-Cookie: mobifix_auth (HttpOnly, SameSite=Strict)
                                                                     │
                                          Response 200 { token }     │
                                                                     ▼
                                                                [Browser]
                                       (TanStack Query usa token nos pedidos seguintes)
```

### 7.2. Pipeline P2 — Agendamento de Diagnóstico (Cliente)
```
Cliente em /FixNRide/agendar:
  1. Seleciona trotinete (lista vem de GET /api/Trotinetes — NIF extraído do JWT no LN)
  2. Sistema informa que preço final depende do diagnóstico
  3. GET /api/Agenda (filtrar slots livres)
  4. Cliente escolhe slot
  5. POST /api/Servicos { TrotineteNumSerie, FeedbackCliente, IntervencaoInicialD: 3 }
       └─▶ ServicoService gera ServicoID aleatório, cria com Estado=AGENDADO
  6. POST /api/Agenda { mecanicoId, servicoId, tipoSlot:"DIAGNÓSTICO", dataHoraInicio }
  7. Frontend invalida queries [servicos] e [agendas]
```
**Pós-condições:** slot fica RESERVADO; agenda mostra novo evento ao mecânico.

### 7.3. Pipeline P3 — Diagnóstico e Geração da Guia de Reparação (Mecânico)
```
Mecânico em /FixNRepair/diagnosticos:
  1. Vê dashboard de slots DIAGNÓSTICO do dia (GET /api/Agenda?mecanicoId=&data=...)
  2. Clica num slot → abre ficha (GET /api/Servicos/{id})
  3. Preenche descricaoDiagnostico, feedbackCliente
  4. Seleciona intervenções do catálogo (GET /api/IntervencoesCatalogo?especialidade=...)
  5. Para cada intervenção, sistema soma precoFixoMaoDeObra
  6. PUT /api/Servicos/{id} { Estado:"EXECUCAO", HistoricoIntervencoes:[...], Preco:total }
  7. Geração de PDF da Guia de Reparação (lado cliente, com jsPDF)
```

### 7.4. Pipeline P4 — Execução da Reparação (Mecânico, registo de peças)
```
Para cada peça utilizada:
  1. Scanner EAN preenche campo
  2. Validação local + chamada GET /api/Pecas/{ean} para verificar stock e modelo
  3. PUT /api/Servicos/{id} adiciona ao subdocumento pecasUtilizadas
  4. Data API decrementa stockAtual da peça correspondente
  5. Se stockAtual <= stockMinimo:
        Data API cria EncomendaStock { pecaId, quantidade: padraoReposicao, estado:"PENDENTE" }
        Aparece no painel da admin (dashboard de aprovações)

Ao concluir última intervenção:
  1. PUT /api/Servicos/{id} { Estado:"CONCLUIDO", DataConclusao: now }
  2. ServicoService dispara fire-and-forget Task.Run(NotificarConclusaoAsync)
        → EmailService.Send(cliente.email, "A sua trotinete está pronta")
  3. Recalcula tempo estimado médio (com tempo real apurado) para futuras estimativas
```

### 7.5. Pipeline P5 — **Levantamento Atómico de Trotinete + Faturação** (Operador) ★
**O pipeline mais complexo — a equipa deve dominar este passo-a-passo.**
```
Operador em /FixNSell/trotinetes-prontas:
  1. GET /api/Servicos/prontas (lista de Estado=CONCLUIDO com NIF destacado)
  2. Operador identifica trotinete pelo NIF do cliente
  3. Apresenta resumo (peças + mão de obra calculado pelo mecânico)
  4. Operador escolhe método pagamento (MBWAY|MULTIBANCO|NUMERARIO)
  5. PUT /api/Servicos/{id}/levantar { MetodoPagamento }
       │
       ├─ GET serviço da Data API
       ├─ Identifica cliente proprietário (via trotineteId → clienteId)
       ├─ Calcula valorTotal (soma de intervenções + peças, aplicando promoções ativas)
       ├─ POST /api/faturas { _id: FT-XXXXXX, clienteId, servicoId, valorTotal, metodoPagamento }
       ├─ PUT /api/servicos/{id} { estado:"FECHADO" }
       ├─ Email assíncrono para o cliente com fatura PDF
       └─ Response 200 { fatura, servicoAtualizado }
  6. Operador entrega fisicamente a trotinete
  7. Frontend invalida [servicos], [faturas], [trotinetes-prontas]
```
**Pontos críticos:**
- Tudo numa única chamada do frontend → atomicidade garantida no servidor (não no browser).
- Total **recalculado no servidor** — protege contra manipulação no cliente.
- Em caso de falha de pagamento, serviço permanece CONCLUIDO; não há entrega.

### 7.6. Pipeline P6 — Venda Direta ao Balcão (Operador)
```
Operador em /FixNSell/vendadireta:
  1. Pesquisa peças por nome/EAN (GET /api/Pecas?q=)
  2. Adiciona ao carrinho local; frontend mostra total estimado
  3. POST /api/Vendas/direta { Itens:[{PecaEAN, Quantidade}], MetodoPagamento, OperadorId }
       │
       ├─ VendaService valida stock de cada peça
       ├─ Recalcula total (com promoções ativas)
       ├─ Cria Venda { ..., total, itensVenda }
       ├─ Cria Fatura { vendaId, valorTotal, metodoPagamento }
       ├─ Decrementa stockAtual de cada peça (nunca permite negativo)
       └─ Se stockAtual <= stockMinimo: cria EncomendaStock PENDENTE
  4. Response 200 com VendaComFaturaDto
  5. Frontend imprime/envia fatura PDF
```
**Regras chave:** stock nunca vai a negativo; total sempre recalculado server-side; promoções aplicadas automaticamente.

### 7.7. Pipeline P7 — Click & Collect (Cliente reserva, Operador entrega)
**Fase A — Reserva (Cliente)**
```
Cliente em /FixNRide/catalogo:
  1. GET /api/Pecas — vê catálogo com disponibilidade
  2. Adiciona ao carrinho
  3. POST /api/EncomendaCliente { Itens } — NIF extraído do JWT
       └─ EncomendaClienteService:
            - Task.WhenAll para validar stock e obter PVPs em paralelo
            - Calcula total
            - Decrementa stockAtual (reserva)
            - Cria EncomendaCliente { estado:"PRONTO PARA LEVANTAMENTO" }
            - Se stock baixo: cria EncomendaStock PENDENTE
  4. Cliente recebe confirmação para levantar em loja
```
**Fase B — Levantamento (Operador)**
```
Operador em /FixNSell/pecas-reservadas:
  1. GET /api/EncomendaCliente/prontas
  2. Pesquisa por NIF
  3. PUT /api/EncomendaCliente/{id}/levantar { MetodoPagamento }
       └─ Cria fatura, transita estado para ENTREGUE, regista faturaId
  4. Frontend invalida queries; fatura disponibilizada
```

### 7.8. Pipeline P8 — Aprovação e Receção de Encomenda de Stock
```
Geração automática (background):
  Sistema gera EncomendaStock PENDENTE sempre que stockAtual <= stockMinimo

Fluxo de aprovação (Administrador):
  1. GET /api/EncomendaStock?estado=PENDENTE
  2. Admin revê quantidade sugerida (pode ajustar)
  3. PUT /api/EncomendaStock/{id} { Estado:"TRANSITO", AdminValidadorId }
        ├─ Aprovação: transita para TRANSITO
        └─ Rejeição: DELETE /api/EncomendaStock/{id}

Fluxo de receção (Operador ou Admin):
  1. GET /api/EncomendaStock?estado=TRANSITO
  2. Confere quantidades entregues vs. encomenda
  3. PUT /api/EncomendaStock/{id} { Estado:"RECECIONADA", OperadorRececaoId }
        └─ Trigger automático: PUT /api/pecas/{pecaId} incrementa stockAtual += quantidade
```
**Máquina de estados:** `PENDENTE → TRANSITO → RECECIONADA` (transições irreversíveis).

### 7.9. Pipeline P9 — Devolução com Nota de Crédito
```
Operador em fluxo de devolução:
  1. Cliente apresenta fatura
  2. GET /api/Faturas/{numero}
  3. Operador seleciona itens a devolver (devolução parcial ou total)
  4. POST /api/Faturas/devolucao/{numero} { Motivo, Itens }
       │
       ├─ Recalcula valor a creditar (considerando promoção da altura)
       ├─ Push no array fatura.devolucoes:
       │     { dataDevolucao, motivo, notaCredito.valorCreditado }
       ├─ Incrementa stockAtual das peças devolvidas
       └─ Atualiza KPIs (montante devolvido do dia)
```
**Decisão arquitetural:** devolução **embutida** na fatura original ⇒ rastreabilidade fiscal preservada, não se apaga histórico.

### 7.10. Pipeline P10 — Consulta de Estatísticas (Admin)
```
Admin em /FixNManage/dashboard:
  1. Seleciona intervalo de datas
  2. GET /api/Estatisticas/intervalo?inicio=&fim=
       └─ EstatisticasService agrega de múltiplas colecções:
            - faturas (faturação total, divisão peças/mão-de-obra)
            - servicos (nº, tempo médio reparação)
            - vendas (nº, ticket médio)
            - devoluções (montante devolvido)
  3. Frontend renderiza gráficos
  4. Permite export para PDF
```

### 7.11. Pipeline P11 — Logout
```
[Browser] ── POST /api/Auth/logout (com cookie) ──▶ [LN AuthController]
                                                          │
                              User.FindFirst(jti).Value   │
                                                          ▼
                                 TokenListService.Revoke(jti)
                                                          │
                              Response.Cookies.Delete("mobifix_auth")
                                                          │
                                                Response 200
                                                          │
                                                          ▼
                                                    [Browser]
                                  queryClient.clear()  → /auth
```

---

## 8. Geração de Código com LLMs

### 8.1. Modelo usado
**Claude Sonnet 4.6** (Anthropic), via extensão **Claude Code** para VS Code.

### 8.2. Restrição central: **janela de contexto limitada**
Tentar implementar um módulo completo (Schemas + DTOs + endpoints + Service + componente React) numa só sessão **degrada a coerência**: nomes de endpoints alucinados, contradições com contratos já definidos, regras de negócio ignoradas.

### 8.3. Resposta metodológica: **Taxonomia de Sessões**
| Tipo | Propósito | Granularidade |
|---|---|---|
| **Sessões de camada** | Decisões transversais (estrutura de pastas, padrão de erro) | Grossa |
| **Sessões de módulo** | Um domínio funcional dentro de uma camada | Média |
| **Sessões de correção** | Bug específico, contexto mínimo | Cirúrgica |

### 8.4. **System brief** com 5 secções fixas (decorar)
1. Arquitetura global e papel do serviço a implementar.
2. Schemas Mongoose ou DTOs relevantes (colados literalmente).
3. Endpoints da Data API disponíveis para consumo.
4. Regras de negócio do módulo (extraídas dos Casos de Uso).
5. **Restrições explícitas** (sem acesso direto ao MongoDB, formato de erro, padrão de auth).

### 8.5. Padrão de iteração (4 passos)
1. Revisão humana do código gerado.
2. Sessão de refinamento com lacunas identificadas.
3. **Teste de integração** ponta-a-ponta.
4. Sessão de correção cirúrgica.

### 8.6. Lições aprendidas (a IA exige supervisão)
**Vantagens:**
- Aceleração de **40–50%** na produção do código base.
- Qualidade estrutural e consistência idiomática.
- Transferência de conhecimento implícita (interrogar o modelo).
- Deteção proativa de lacunas na especificação.

**Limitações (smells recorrentes):**
- **Alucinações** plausíveis mas erradas (ex: endpoints inexistentes).
- Tendência a **normalizar excessivamente** os schemas MongoDB (sugeriu intervenções como coleção separada).
- Tendência a generalizar (sugeriu OAuth em vez do JWT especificado, SQL Server em vez de MongoDB).
- Sem visão sistémica: gera **localmente correto, globalmente inconsistente**.
- **Code smells recorrentes:**
  - `parseJwt` duplicado em ≥5 ficheiros (corrigido em `utils/auth.js`).
  - `alert()` nativo em vez de toasts (corrigido parcialmente com `sonner`).
  - Mapeamento defensivo `o.PecaEAN || o.pecaEAN` (deve ser padronizado em PascalCase).
  - `Random.Shared.Next` para gerar IDs (race conditions possíveis).
  - Magic strings para estados (devem virar `enum`).

### 8.7. Fronteira metodológica (importante para defesa oral)
> *Diagramas UML **inteiramente humanos**. Modelo de Domínio, Casos de Uso, Sequência, Estados — todos foram concebidos pela equipa. A IA **não fez análise de domínio**.*

---

## 9. Verificação, Validação e Qualidade

### 9.1. Estratégia de testes (justificação)
| Tipo | Cobertura | Ferramenta |
|---|---|---|
| **Unitários** | **Não implementados** — escolha consciente (delegar valor para integração) | — |
| **Integração** | Todos os endpoints da Data API; scripts JS em cada request | **Postman** (collection com 24+ TCs) |
| **Sistema** | Fluxos completos por perfil | Browser manual |
| **Aceitação** | Cenários dos 4 perfis com seed data | Manual |
| **Stress** | 5/20/50 VUs em endpoints GET | **Postman Performance** |
| **Edge cases sugeridos por IA** | Tokens inválidos, NIF inválido, levantar trotinete em EXECUCAO | Postman |

### 9.2. Resultados de stress (decorar a tabela)
| Cenário | VUs | Duração | P50 | P95 | P99 | Erro | req/s |
|---|---|---|---|---|---|---|---|
| Base | 5 | 1 min | <4 ms | <5 ms | <11 ms | 0% | ~18 |
| Moderada | 20 | 2 min | <16 ms | <19 ms | <31 ms | 0% | ~55 |
| Pico | 50 | 2 min | <39 ms | <46 ms | <76 ms | <2% | ~90 |

**Conclusão:** RNF1 (resposta < 2 s) **satisfeito com margem** mesmo em pico. Erros residuais a 50 VUs atribuídos a timeouts ocasionais no pool MongoDB.

### 9.3. ISO/IEC 25010 — Avaliação Qualitativa
| Característica | Classificação | Evidência |
|---|---|---|
| Adequação Funcional | **Alta** | 22/22 RF críticos validados |
| Fiabilidade | **Moderada** | Fail-fast no arranque; **sem retry inter-serviços** (limitação) |
| Usabilidade | **Boa** | Interfaces contextuais por perfil; `alert()` ainda em alguns hooks |
| Eficiência | **Adequada** | P95 < 900 ms a 50 VUs; índices + cache TanStack |
| Manutenibilidade | **Boa** | Modular por domínio; duplicação `parseJwt` corrigida |
| Segurança | **Alta** | BCrypt + JWT/HMAC-SHA256 + CORS + cookies HttpOnly |
| Portabilidade | **Alta** | Contentorização total |
| Compatibilidade | **Boa** | REST/JSON, CORS, browsers modernos |

---

## 10. Trabalho Futuro e Lições

### 10.1. Backlog priorizado
**Alta:**
- Refresh token de 7 dias em cookie HttpOnly (atualmente sessão única de 8 h).
- Persistir `TokenListService` em Redis (atualmente in-memory).

**Média:**
- Suíte Vitest (frontend) + xUnit/NUnit (backend, em particular `ServicoService.LevantarComFaturaAsync`).
- Substituir todos os `alert()` por `sonner` toasts.
- Tipificar enums (`EstadoServico`, `EstadoEncomenda`) em C#.
- Retry com Polly nas chamadas LN → Data API.

**Baixa:**
- Sistema de envio de **emails** real (subsistema já preparado mas sem provider).
- **PWA** para mecânicos (service worker + instalação no tablet).
- Integração real com MB WAY / Multibanco.
- Audit log MongoDB (conformidade RGPD).

### 10.2. Conclusão metodológica (essencial)
> *A IA generativa **não substitui** o engenheiro de software — substitui a parte mais mecânica do trabalho. O julgamento técnico, a visão sistémica, a decisão arquitetural e a validação rigorosa permanecem responsabilidades irredutíveis da equipa humana. A IA é amplificador de capacidade, não substituto de competência.*

---

## 11. Perguntas de Exame

> **Nível: professor universitário exigente em defesa de projeto.**
> As perguntas são organizadas por temática crescente em dificuldade. Tentem responder em voz alta, no quadro, usando os diagramas que vão apresentar.

### 11.1. Engenharia de Requisitos
**Q1.** Os métodos de levantamento incluíram observação direta. Como conciliaram **viés do observador** com o rigor exigido pelo SRS? Que medidas tomaram para garantir que o requisito **RF12** (encomenda automática ao stock mínimo) **não foi induzido** pela vossa observação enviesada do funcionamento de uma oficina genérica?

**Q2.** No vosso refinamento de requisitos ambíguos, a frase *"O sistema deve ser rápido"* tornou-se *"P95 < 2 s em leituras"*. Por que escolheram **P95** e não P50, P99 ou tempo médio? Qual a implicação estatística desta escolha para a experiência do utilizador?

**Q3.** O RNF4 obriga a stack `React + .NET + MongoDB`. Trata-se de **restrição de implementação** ou de **requisito não-funcional puro**? Defendam a vossa classificação à luz da norma **ISO/IEC/IEEE 29148**.

**Q4.** Identificaram 22 RFs. Quantos são **strictly testable** (podem ser verificados por um teste boolean PASS/FAIL)? Apontem 3 RFs em que a verificação **exige interpretação humana** e proponham reformulações mensuráveis.

**Q5.** O vosso modelo de domínio embute `Intervencao` em `Servico` (composição). Esta decisão **conceptual** condiciona a decisão **persistente** (embedding em MongoDB). Em que circunstâncias deveriam ter mantido as decisões **independentes**? Dêem um exemplo concreto onde o modelo de domínio sugeriria embedding mas a persistência exigiria referencing.

### 11.2. Arquitetura
**Q6.** Justificam que a separação **Data API ↔ LN** previne *"acesso direto à base de dados"*. Mas a `INTERNAL_API_KEY` é uma simples chave partilhada em ambiente. Se um atacante obtiver acesso ao container `ln`, **obterá imediatamente** a chave e acederá à Data API. Que mecanismos de **defesa em profundidade** considerariam? (mTLS, rotação de chaves, service mesh, network policies)

**Q7.** O diagrama de componentes mostra dependência **unidirecional** `frontend → ln → data-api → mongodb`. E **eventos assíncronos**? (ex: notificação de email quando serviço fica CONCLUIDO). Como modelariam um **event bus** sem violar a vossa topologia atual?

**Q8.** A vossa Data API expõe CRUDs genéricos. Isto viola o princípio de **API por caso de uso** vs. **API por recurso** (anti-pattern *"anaemic API"*). Que custo arquitetural pagaram por esta escolha?

**Q9.** O caminho crítico identificado é a camada LN. Se a equipa atrasasse 1 semana o LN, qual seria o **impacto real** no projeto? Justifiquem com base no diagrama de Gantt e na vossa estratégia de **mocks**.

**Q10.** Justificam o MongoDB com base em "natureza hierárquica e agregada". Mas a `Fatura` referencia `Cliente`, `Servico` **e** `Venda` (relações N:1). Em PostgreSQL com JSON columns, **conseguiriam** o mesmo? O que exatamente o MongoDB vos dá que PostgreSQL+JSONB **não** dá?

### 11.3. Persistência
**Q11.** O `_id` de `Cliente` é o **NIF**. Que problemas legais (**RGPD**) decorrem desta escolha? Como se garantia o "direito ao esquecimento" mantendo as faturas históricas referenciadas pelo NIF?

**Q12.** `historicoIntervencoes` é embutido em `Servico`. Considerem um serviço com **30 intervenções** ao longo de um ano (caso patológico). Que limites do BSON são atingidos? Qual o **tamanho máximo de um documento** MongoDB e como mitigariam?

**Q13.** O `init.sh` cria índices **apenas** nos campos mais frequentemente consultados. Como detetariam, em produção, que falta um índice? Que ferramenta MongoDB usariam? (`explain()`, *profiler*, MongoDB Atlas Performance Advisor)

**Q14.** A integridade referencial é mantida pela **aplicação** (não pela BD). Imaginem que apagam um `Funcionario` que aparece em 1000 `Servico.historicoIntervencoes[].mecanicoId`. O que acontece? Como o resolveriam? (soft delete + `ativo: false` — já têm; e o `.populate()` falha?)

### 11.4. Lógica de Negócios / Segurança
**Q15.** O endpoint `PUT /api/Servicos/{id}/levantar` é descrito como "atómico". Mas envolve 4 operações HTTP sequenciais para a Data API. Se **a 3ª falhar**, o que acontece? O sistema fica em **estado inconsistente**? Que padrão usariam para garantir atomicidade real? (Saga, 2PC, transações MongoDB multi-document desde 4.0)

**Q16.** A `TokenListService` é **singleton in-memory**. Cenário: **2 réplicas do serviço LN** em produção atrás de um load balancer. Um utilizador faz logout no Pod A; o seu próximo request chega ao Pod B. **O token ainda é aceite**. Como resolveriam? (Redis, ETag de chave, JWT revocation list distribuída)

**Q17.** O JWT tem validade de **8 horas** sem refresh token. Se um operador inicia turno às 8h e o token expira às 16h durante uma venda, o que acontece à UX? O *trabalho futuro* prevê refresh tokens — desenhem o **fluxo completo** com refresh em cookie HttpOnly.

**Q18.** A chave `JwtSettings__SecretKey` é partilhada entre LN e Data API. Quando rotacionarem a chave, **todos os tokens emitidos são invalidados** simultaneamente. Como suportariam **rotação sem downtime**? (key ID em claim `kid`, suporte a 2 chaves em transição, JWKS endpoint)

**Q19.** A vossa CORS policy é `WithOrigins("http://localhost:3000", "http://localhost:3001")` com `AllowCredentials()`. Em produção, isto **falha**. Quais as alterações necessárias e que implicações de segurança têm? (HTTPS obrigatório por causa de `Secure` cookies, `SameSite=Strict` quebra single sign-on cross-domain)

**Q20.** Como protegem contra **mass assignment** em `PUT /api/Servicos/{id}`? O vosso `AtualizarServicoAsync` aceita um `Dictionary<string, object?>` — um atacante poderia injetar `Preco: 0` ou `Estado: "FECHADO"` sem ter passado pelo fluxo de levantamento. Como mitigam?

**Q21.** A `INTERNAL_API_KEY` é injetada em `x-api-key` em **todos** os pedidos LN → Data API. Os logs do `morgan` registam esses headers? Se sim, **a chave fica nos logs**. Que cuidados de **logging seguro** implementaram?

### 11.5. Frontend
**Q22.** O `ProtectedRoute` faz verificação **client-side** do JWT. Um atacante pode modificar o JavaScript no browser e contornar a verificação. Qual o vosso **modelo de ameaças** para esta verificação? (a verificação real está no servidor; a do frontend é UX)

**Q23.** `staleTime: 1` para peças força revalidação **constante** — não anula a vantagem do cache TanStack Query? Quando usariam **`refetchInterval`** em vez de `staleTime`?

**Q24.** O `parseJwt` decodifica o payload **sem verificar assinatura**. Isto é seguro? Quais as implicações de **mostrar o nome do utilizador** baseado num JWT que pode ter sido alterado pelo cliente?

**Q25.** Os layouts pais (`Layout`, `RepairsLayout`, `AdminLayout`) renderizam `<Outlet />`. Que problema de **state management** surge quando o utilizador navega entre subpáginas e perde o estado do formulário? Como o resolveriam idiomaticamente em React 18? (`React Router actions`, formulários controlados com `useContext`, libraries como `react-hook-form` com persistência)

**Q26.** O TanStack Query faz **atualização otimista** na lista de serviços. Se a mutação falhar **após** terem feito `setQueryData`, a UI mostra dados errados. Como reconciliam? (`onError` com rollback usando contexto/snapshot)

### 11.6. Qualidade, Testes e Processo
**Q27.** Decidiram **não fazer testes unitários** justificando análise custo-benefício. Mas no Capítulo 8 admitem que o ServicoService **mereceria** testes unitários. Por que **não fizeram**? Quanto demoraria fazê-los **agora** e qual o ROI esperado em manutenção?

**Q28.** Os testes de stress foram feitos contra a **Data API isolada**. Por que **não testaram** o LN ou o frontend? Como os resultados podem ser **enganadores** se o gargalo real estiver na orquestração do LN?

**Q29.** Justifiquem a sua afirmação **"40-50% de redução de tempo"** com IA. Como **mediram** isto? Tinham linha de base de implementação manual? Como controlaram para a curva de aprendizagem?

**Q30.** Identificaram **5 ocorrências** do `parseJwt` duplicado. Por que não detetaram isso **durante** o desenvolvimento? Que processo de **revisão entre pares** (peer review) adotaram?

**Q31.** No estress test, o cenário de 50 VUs ainda mostrava P99 < 76 ms (de acordo com a Tabela 9.4), mas o texto refere depois "P99 a aproximar-se dos 1,8 segundos". Há **inconsistência factual** no relatório. Como explicam? (foi medida em dois ambientes? Quando?)

**Q32.** A avaliação ISO 25010 é **qualitativa**. Como tornariam **quantitativa** a métrica de **Manutenibilidade**? (índice de Halstead, complexidade ciclomática via SonarQube, percentagem de duplicação)

### 11.7. IA, Ética e Processo de Engenharia
**Q33.** Quem é o **autor** do código? O Claude Sonnet 4.6, vocês ou a Anthropic? Qual o regime de **propriedade intelectual** que aplicaria a este projeto se fosse comercial?

**Q34.** O relatório indica que "a IA gerou código com **alucinações plausíveis**". Como detetariam alucinações em **regras de negócio sutis** (ex: cálculo de promoções em devoluções) que **passam nos testes de integração** mas estão erradas?

**Q35.** O prompt para a secção de Contextualização foi exposto literalmente. Isto é **rastreabilidade** ou **diluição de autoria**? Como gerariam a **bibliografia** correta de um trabalho que foi co-escrito por IA?

**Q36.** Imaginem que o Claude Sonnet 4.6 é descontinuado amanhã e o Sonnet 5.0 mudou completamente o estilo. **Conseguem manter o sistema?** Como o documentariam para que **outra equipa** consiga continuar com um modelo diferente?

**Q37.** A vossa metodologia **fragmenta sessões por módulo**. Isto **viola** o princípio de **visão sistémica** do engenheiro. Argumentem por que o vosso *system brief* mitiga isto **ou** admitam onde falhou.

### 11.8. Negócio e Validação
**Q38.** Projetam ROI < 18 meses. Que **assumptions** fazem? Validaram com a MobiFix? Caso contrário, **como é académicamente sustentável** um número económico não validado?

**Q39.** A MobiFix existe como caso de estudo. **Sem cliente real**, como sabem que as User Stories representam o **trabalho real** de um operador de loja? Que **risco de generalização excessiva** correm?

**Q40.** Se a MobiFix abrir uma **segunda oficina** noutra cidade, o sistema **suporta multi-tenant**? O que muda no modelo de dados, nas regras de RBAC e na infraestrutura?

---

## Anexos rápidos para revisão

### A. Cores e prefixos para decorar
- `/FixNRide` = **Cliente** (azul/roxo, mobile-first)
- `/FixNSell` = **Operador** (sidebar)
- `/FixNRepair` = **Mecânico** (dashboard denso)
- `/FixNManage` = **Administrador** (dashboard + sidebar)

### B. Estados das principais entidades
- **Serviço:** `AGENDADO → EXECUCAO → CONCLUIDO → FECHADO`
- **EncomendaStock:** `PENDENTE → TRANSITO → RECECIONADA`
- **EncomendaCliente:** `PRONTO PARA LEVANTAMENTO → ENTREGUE`
- **Agenda slot:** `RESERVADO → CONCLUIDO`

### C. Cabeçalhos críticos
- LN → Data API: `x-api-key: ${INTERNAL_API_KEY}` + `Authorization: Bearer {jwt}` (propagado)
- Frontend → LN: `Authorization: Bearer {jwt}` (interceptor Axios) **ou** cookie `mobifix_auth`

### D. Comandos de arranque
```bash
cp .env.example .env       # editar valores secretos
docker compose up --build  # arranque completo
# Frontend: http://localhost:3000
# LN Swagger: http://localhost:5001/swagger
# Data API: http://localhost:3001/api
```

### E. Utilizadores de seed (decorar pelo menos um por perfil)
- Admin: `ADM001 / Admin1234`
- Operador: `OPE001 / ...`
- Mecânico: `MEC001 / ...`
- Cliente: NIF `250123456 / ...`

---

**Boa apresentação. Lembrem-se:** a IA é a vossa **caneta**, vocês são os **engenheiros**.
