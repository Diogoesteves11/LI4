# Guia de Estudo Completo — Fix'n'Ride
## LI4 | Ciclo de Vida de Desenvolvimento de Software Assistido por LLM

> Este documento é um guia de estudo exaustivo para a discussão do projeto. Cobre as quatro etapas do enunciado em profundidade, com os conceitos teóricos subjacentes, as decisões tomadas e a justificação de cada uma delas.

---

# ETAPA 1 — CONCEÇÃO E ENGENHARIA DE REQUISITOS

## 1.1 Definição do Domínio e do Problema

**O que é o domínio do problema?**
O domínio é a gestão operacional de uma oficina de reparação de micromobilidade elétrica (trotinetes). A MobiFix é uma oficina multimarca que cresceu rapidamente e que continua a operar com processos manuais (papel e folhas de cálculo). Isso cria problemas concretos e mensuráveis:
- Mecânicos perdem fichas de reparação em papel → erros de faturação
- Stock gerido manualmente → rutura de peças críticas ou imobilização de capital
- Administração sem métricas → impossibilidade de calcular rentabilidade por serviço
- Cliente sem visibilidade → excesso de chamadas para ponto de situação

**Por que este domínio justifica um sistema de informação?**
Porque tem entidades bem definidas com estados controlados (ordens de serviço, encomendas, peças), múltiplos atores com responsabilidades distintas, e processos transacionais que exigem rastreabilidade (faturação, devoluções, garantias).

---

## 1.2 Identificação de Stakeholders

**Quem são os stakeholders e o que cada um precisa?**

| Stakeholder | Papel | Necessidade Principal |
|---|---|---|
| Administradora (Ana) | Gestão estratégica e financeira | Métricas em tempo real, controlo de stock, aprovação de compras |
| Mecânico (Pedro) | Execução técnica | Acesso rápido a histórico, catálogo de intervenções com preços fixos, registo de peças por EAN |
| Operador de Loja (João) | Atendimento ao balcão e logística | Venda direta rápida, painel de trotinetes prontas, receção de encomendas |
| Cliente Final | Utilizador dos serviços | Agendamento online, acompanhamento da reparação, histórico de faturas |

**Por que é importante identificar stakeholders antes de levantar requisitos?**
Porque diferentes stakeholders têm perspetivas diferentes, por vezes conflituantes, sobre o mesmo sistema. Um requisito que parece simples para um utilizador pode implicar mudanças complexas para outro. Identificar stakeholders primeiro garante que nenhuma perspetiva crítica é ignorada.

---

## 1.3 Métodos de Levantamento de Requisitos

**Que métodos foram usados e porquê esta combinação?**

**1. Questionários de formato livre** — enviados a operadores, mecânicos e clientes para recolher opiniões e identificar os maiores pontos de dor no dia-a-dia. Vantagem: alcance amplo, baixo custo. Limitação: respostas superficiais, sem profundidade técnica.

**2. Observação direta** — acompanhamento do fluxo de trabalho real, desde a receção da trotinete até à faturação. Permitiu identificar problemas que os utilizadores nem verbalizam porque já estão habituados a eles (e.g., o mecânico que tem de se deslocar ao armazém para verificar stock porque não tem sistema).

**3. Entrevistas estruturadas** — realizadas com os três perfis internos (não com clientes). Cada entrevista teve um objetivo específico e perguntas preparadas. Esta estrutura garante que os temas críticos são cobertos e que as respostas são comparáveis.

**Por que a observação direta é especialmente valiosa?**
Porque capta requisitos implícitos — comportamentos que os utilizadores consideram normais mas que revelam problemas estruturais. Exemplos encontrados: mecânico anota peças num papel que depois se perde; operador não sabe se trotinete está pronta sem ligar ao mecânico.

---

## 1.4 Conteúdo das Entrevistas

**Entrevista com a Administradora Ana:**
- Problema central: "Perco dinheiro com peças paradas que ninguém usa e, ao mesmo tempo, perco clientes porque não temos pneus básicos em stock."
- Necessidade: alertas de stock mínimo com encomenda automática, mas com aprovação manual da administração para controlo de fluxo de caixa.
- Requisitos originados: RF-12 (aprovação de encomendas), RF-13 (dashboard de KPIs), RF-09 (gestão de promoções).

**Entrevista com o Operador João:**
- Problema central: "Vender um capacete demora imenso porque tenho de preencher os mesmos dados de uma reparação complexa."
- Necessidade: fluxo de venda direta simplificado; painel de trotinetes prontas visível sem contactar o mecânico.
- Requisitos originados: RF-19 (venda direta), RF-21 (levantamento com faturação), RF-20 (entrega de encomenda de cliente).

**Entrevista com o Mecânico Pedro:**
- Problema central: "Usamos papel. Esqueço-me de anotar a peça que usei ou o papel desaparece."
- Necessidade: tablet na bancada com catálogo de intervenções e preços fixos, registo de peças por EAN.
- Requisitos originados: RF-15 (guia de reparação), RF-16 (registo de peça utilizada), RF-17 (estado da reparação).

---

## 1.5 Requisitos Funcionais — Os 22

**Área Autenticação (RF-01 a RF-03, RF-07):**
- RF-01: Registo de cliente (NIF, nome, contacto, morada, email, password)
- RF-02: Login de cliente (NIF + password → JWT + redirecionamento para área pessoal)
- RF-03: Registo de trotinete (número de série, marca, modelo → associada ao cliente)
- RF-07: Login de funcionário (nº mecanográfico + password → JWT com role)

**Área Serviços (RF-05, RF-06, RF-15, RF-16, RF-17):**
- RF-05: Marcação de diagnóstico online (seleção de trotinete + horário disponível)
- RF-06: Consulta de histórico de faturas e reparações pelo cliente
- RF-15: Preencher guia de reparação (seleção de intervenções do catálogo + geração de PDF)
- RF-16: Registo do código EAN da peça utilizada (validação de stock + desconto automático)
- RF-17: Alteração automática do estado da reparação (AGENDADO → EXECUCAO → CONCLUIDO; notificação ao cliente)

**Área Stock e Encomendas (RF-04, RF-08, RF-12, RF-18):**
- RF-04: Reserva de peças pelo cliente (Click & Collect; gera alerta se stock mínimo atingido)
- RF-08: Listagem de stock de peças (todos os perfis de funcionário)
- RF-12: Aprovação de encomendas pendentes (PENDENTE → EM TRÂNSITO; com opção de editar quantidade)
- RF-18: Receção de encomenda (confirmar quantidades → RECECIONADA; incrementa stock)

**Área Financeira (RF-09, RF-10, RF-11, RF-13, RF-19, RF-20, RF-21, RF-22):**
- RF-09: Gestão de promoções (percentagem, período de vigência, peças aplicáveis)
- RF-10: Edição do catálogo de peças
- RF-11: Edição do catálogo de intervenções
- RF-13: Dashboard de KPIs financeiros e operacionais
- RF-19: Venda direta ao balcão (EAN → carrinho → fatura)
- RF-20: Entrega de encomenda de cliente (Click & Collect → estado ENTREGUE)
- RF-21: Levantamento de trotinete e faturação (atómico: serviço + fatura)
- RF-22: Processar devolução (nota de crédito + reposição de stock)

**Área Utilizadores (RF-14):**
- RF-14: Registo de novo funcionário (número mecanográfico único, cargo, password cifrada)

---

## 1.6 Requisitos Não Funcionais — Os 5

| RNF | Descrição | Justificação |
|---|---|---|
| RNF-01 | Tempo de resposta ≤ 2 segundos para leituras | Atendimento ao balcão não pode ter esperas |
| RNF-02 | Interface responsiva (desktop + tablet) | Mecânicos usam tablets na bancada |
| RNF-03 | Validação de todos os inputs; sem crashes | Utilizadores com diferentes literacias digitais |
| RNF-04 | Stack: React + .NET + MongoDB | Restrição curricular e decisão da equipa |
| RNF-05 | RBAC + hashing de passwords (BCrypt) | Dados financeiros só visíveis para administradores |

---

## 1.7 Refinamento de Requisitos Ambíguos

Este é um passo frequentemente esquecido mas muito valorizado pelos professores. Converte linguagem informal em especificações mensuráveis:

| Necessidade Inicial | Ambiguidade | Requisito Refinado |
|---|---|---|
| "O sistema deve ser rápido" | O que é rápido? Depende da ligação? | Tempo de resposta ≤ 2 segundos para leituras em condições normais (RNF-01) |
| "Controlar melhor o stock" | Manual ou automático? Quais as ações? | Geração automática de ordem pendente ao atingir stock mínimo; aprovação manual da administração (RF-12) |
| "Permitir vender peças" | Inclui serviços? Só itens físicos? | Diferenciação no catálogo entre "Peça" (com stock) e "Intervenção" (sem stock físico) |

---

## 1.8 Modelo de Domínio

**O que é e para que serve?**
O Modelo de Domínio é uma representação estática concetual das entidades de negócio, as suas propriedades e as relações entre elas. Serve como vocabulário comum entre a equipa técnica e os stakeholders, e como base para o design da base de dados.

**Entidades principais e o que representam:**
- **Cliente** — proprietário das trotinetes; responsável financeiro das faturas
- **Trotinete** — veículo sujeito a reparação; associada a um único cliente; tem histórico de serviços
- **Serviço de Reparação** — entidade central; agrega o ciclo de vida completo de uma reparação
- **Intervenção** — operação técnica realizada na trotinete; composta por mão de obra + peças
- **Peça** — artigo físico com stock; pode ser vendido ou incorporado numa intervenção
- **Fatura** — documento fiscal; originado por um Serviço ou por uma Venda
- **Nota de Crédito** — subdocumento da Fatura; emitido em caso de devolução
- **Encomenda de Stock** — pedido de reposição ao fornecedor; ciclo PENDENTE → TRANSITO → RECECIONADA
- **Encomenda de Cliente** — reserva Click & Collect; ciclo PRONTO PARA LEVANTAMENTO → ENTREGUE
- **Funcionário** — colaborador com acesso ao sistema; especializado em Administrador, Operador ou Mecânico

**Relacionamentos-chave e cardinalidades:**
- Cliente 1:N Trotinete (um cliente tem várias trotinetes; cada trotinete tem um dono)
- Trotinete 1:N Serviço (histórico de reparações ao longo da vida da trotinete)
- Serviço 1:1 Guia de Reparação (obrigatório; gerado no diagnóstico)
- Serviço 1:N Intervenção (mínimo uma)
- Intervenção 0:N Peça (algumas intervenções são só mão de obra)
- Venda/Serviço 1:1 Fatura (mutuamente exclusivos — uma fatura origina-se num ou noutro, nunca em ambos)

---

## 1.9 Casos de Uso

**O que são Casos de Uso e qual o seu valor?**
Um Caso de Uso descreve uma interação entre um ator e o sistema para atingir um objetivo específico. O valor está em capturar o comportamento esperado do sistema do ponto de vista do utilizador, incluindo fluxos alternativos e de exceção — não apenas o "caminho feliz".

**Casos de Uso mais importantes para saber em detalhe:**

**UC01 — Agendar Diagnóstico**
- Pré-condições: cliente autenticado com trotinete registada
- Fluxo: selecionar trotinete → ver horários disponíveis → confirmar → slot criado na agenda
- Pós-condições: serviço com estado AGENDADO; horário bloqueado para outros clientes

**UC04 — Faturar Serviço e Entregar Trotinete** (o mais complexo)
- Pré-condições: serviço no estado CONCLUIDO
- Fluxo: operador pesquisa trotinete pelo NIF → sistema mostra valor total (peças + mão de obra) → operador seleciona método de pagamento → sistema emite fatura → estado transita para FECHADO
- Fluxo de exceção: pagamento rejeitado → sistema mantém CONCLUIDO; trotinete não sai
- Por que é complexo: quatro operações coordenadas numa única transação

**UC17 — Processar Devolução**
- Fluxo: operador insere número de fatura → sistema carrega itens → sistema calcula valor (considerando promoções originais) → emite Nota de Crédito → repõe stock
- Nota: a nota de crédito é embutida como subdocumento no array devolucoes da fatura original — não é um documento separado

**Hierarquia de generalização nos atores:**
O "Funcionário" é um ator genérico que representa os comportamentos partilhados por todo o staff (login, consultar stock, consultar agenda). Os atores especializados — Administrador, Operador, Mecânico — herdam estes comportamentos e acrescentam os próprios. O Administrador tem acesso total a todos os módulos.

---

## 1.10 Diagramas de Atividades — Fluxos Críticos

**Fluxo de Diagnóstico:**
Cliente agenda online → mecânico abre slot na agenda → inspeciona trotinete → seleciona intervenções do catálogo → sistema calcula preço total → gera Guia de Reparação em PDF

**Fluxo de Reposição Inteligente:**
Stock atinge mínimo → sistema cria encomenda PENDENTE automaticamente → administradora revê e aprova → estado transita para EM TRÂNSITO → operador recebe fisicamente → confirma quantidades → estado RECECIONADA → stock incrementado

**Por que a aprovação manual é um requisito (e não automática)?**
Porque a administradora precisa de controlar o fluxo de caixa. Uma encomenda automática sem supervisão pode criar problemas de tesouraria. A administradora pode ajustar quantidades, agrupar encomendas ou reter compras consoante a situação financeira do mês.

---

## 1.11 Diagramas de Máquina de Estados

**Estados do Serviço de Reparação:**
```
AGENDADO → EXECUCAO → CONCLUIDO → FECHADO
```
- AGENDADO: criado no momento do agendamento pelo cliente
- EXECUCAO: mecânico realiza primeira intervenção
- CONCLUIDO: todas as intervenções terminadas; sistema envia email ao cliente
- FECHADO: operador registou levantamento e pagamento; fatura emitida

**Estados da Encomenda de Stock:**
```
PENDENTE → TRANSITO → RECECIONADA
```
- PENDENTE: criado automaticamente pelo sistema ao atingir stock mínimo
- TRANSITO: administrador aprovou; encomenda enviada ao fornecedor
- RECECIONADA: operador confirmou receção física; stock incrementado

**Estados da Encomenda de Cliente:**
```
PRONTO PARA LEVANTAMENTO → ENTREGUE
```
- Criada automaticamente após reserva pelo cliente
- Transita para ENTREGUE quando o operador confirma entrega e emite fatura

---

## 1.12 User Stories

Formato padrão: "Como [ator], quero [ação], para que [benefício]"

Exemplos relevantes:
- US01: Como Mecânico, quero selecionar intervenções de um catálogo, para que o sistema aplique o preço fixo tabelado automaticamente.
- US04: Como Administrador, quero que o sistema me alerte para reabastecimento quando uma peça atinge o stock mínimo, para evitar interrupções de serviço.
- US12: Como Cliente, quero agendar um diagnóstico online escolhendo horário disponível, para garantir que a oficina me pode receber sem esperas.
- US13: Como Cliente, quero consultar o estado da minha reparação em tempo real, para saber quando a trotinete está pronta sem telefonar.

**Diferença entre User Story e Caso de Uso:**
A User Story captura o "o quê" e o "porquê" de forma concisa, do ponto de vista do utilizador. O Caso de Uso detalha o "como" — os passos concretos, pré-condições, pós-condições e fluxos de exceção. As User Stories alimentaram as entrevistas com stakeholders; os Casos de Uso foram a especificação técnica formal.

---

# ETAPA 2 — ARQUITETURA E DESIGN DO SOFTWARE

## 2.1 Arquitetura Global — Multi-Tier com Separação de Responsabilidades

**Qual é a arquitetura do sistema?**
Multi-Tier Architecture com separação física e lógica em três camadas independentes, cada uma num contentor Docker:

```
[Frontend React] ↔ [Lógica de Negócios .NET] ↔ [Data API Node.js] ↔ [MongoDB]
```

**Princípio central: Separation of Concerns**
Cada camada tem uma responsabilidade bem delimitada:
- Frontend: apresentação e interação com o utilizador
- Lógica de Negócios: regras de domínio, autenticação, orquestração de processos
- Data API: acesso à base de dados (CRUD)
- MongoDB: persistência de dados

---

## 2.2 A Decisão Arquitetural Mais Importante: Separar Data API de Lógica de Negócios

**Por que dois servidores de backend em vez de um?**

**Razão 1 — Complexidade das regras de negócio:**
A Data API só faz CRUD simples — recebe um pedido, valida campos básicos, persiste no MongoDB. A Lógica de Negócios orquestra processos que envolvem múltiplas entidades e passos interdependentes.
Exemplo concreto — levantamento de trotinete:
1. Consultar o serviço na Data API (verificar estado CONCLUIDO)
2. Determinar o NIF do cliente a partir da trotinete
3. Criar a Fatura via Data API
4. Fechar o serviço (estado FECHADO) via Data API
Sem esta camada, toda esta orquestração teria de ficar no frontend React — comprometendo gravemente a segurança (qualquer utilizador poderia manipular o processo) e a testabilidade.

**Razão 2 — Segurança:**
Toda a autenticação (JWT, BCrypt) vive no servidor .NET. A Data API é inacessível externamente — só aceita pedidos autenticados pela INTERNAL_API_KEY dentro da rede Docker privada. Nunca há comunicação direta do frontend com a base de dados.

**Razão 3 — Adequação tecnológica:**
.NET 8 tem injeção de dependências nativa, tipagem estática rigorosa, JWT integrado via Microsoft.AspNetCore.Authentication.JwtBearer, e Swagger/OpenAPI automático. Node.js é mais adequado para um gateway de dados leve com I/O não-bloqueante e alta concorrência em operações CRUD.

**Razão 4 — Escalabilidade e manutenibilidade independentes:**
O servidor .NET pode ser replicado sem tocar na Data API. Mudanças nas regras de negócio afetam só o código .NET, sem risco de regressões na camada de dados.

---

## 2.3 Stack Tecnológica e Justificação

**MongoDB + Mongoose (Camada de Persistência)**
- Justificação: entidades hierárquicas com dados aninhados. Um Serviço contém um array de intervenções, cada intervenção contém um array de peças com timestamps. Em SQL: mínimo 3 tabelas + JOINs em cada leitura. Em MongoDB: um único documento + operação findById.
- Mongoose: acrescenta validação de schema, enums de estado, tipos e referências — mitiga os riscos de inconsistência do NoSQL.
- Índices criados no arranque: unicidade em email/NIF de clientes, performance em estado dos serviços e mecanicoId na agenda.

**Node.js + Express (Data API)**
- Justificação: afinidade natural com JSON produzido pelo MongoDB; I/O não-bloqueante adequado para volume elevado de pedidos CRUD concorrentes.

**ASP.NET Core .NET 8 (Lógica de Negócios)**
- Justificação: tipagem estática, DI nativa, BCrypt, JWT integrado, Swagger automático. Adequado para regras de negócio complexas que precisam de ser testáveis isoladamente.

**React + TanStack Query (Frontend)**
- TanStack Query: abstrai comunicação assíncrona com caching automático, revalidação e sincronização com o servidor. Sem ela, cada componente precisaria de useEffect + useState para gerir pedidos, estados de loading e erro.
- staleTime diferenciado: peças (1ms, atualização frequente) vs faturas históricas (5 min, estáveis).

**Tailwind CSS**
- Utility-first: estilo aplicado diretamente no JSX, sem ficheiros CSS separados. Elimina colisões de especificidade CSS. Garante consistência entre os quatro portais.

**Docker + Docker Compose**
- Cadeia de dependências: mongodb → data-api → ln → frontend
- Rede bridge privada: serviços comunicam por nome de contentor como hostname; nada é exposto ao exterior sem necessidade.
- Reprodutibilidade: qualquer elemento da equipa reconstrói o ambiente completo com `docker compose up --build`.

---

## 2.4 Padrão MVC Aplicado em Ambos os Backends

**Na Data API (Node.js):**
- Controllers: recebem pedidos HTTP, validam campos obrigatórios, devolvem respostas HTTP
- Models: Schemas Mongoose — definição estrutural das coleções
- Views: não existem (API REST devolve JSON)

**No servidor .NET:**
- Controllers: recebem pedidos HTTP, validam ModelState, delegam para os Services
- Services: encapsulam a lógica de negócio de cada domínio (AuthService, ServicoService, etc.)
- DTOs (Data Transfer Objects): contratos de dados entre camadas — nenhuma estrutura interna é exposta inadvertidamente

**Organização por domínio funcional:**
Ambos os backends são organizados em módulos por domínio: autenticação, serviços, stocks, finanças, catálogos, utilizadores. Cada módulo tem o seu próprio controller, service e conjunto de DTOs.

---

## 2.5 Segurança — Fluxo JWT em 7 Passos

**1.** Utilizador submete credenciais (NIF ou nº mecanográfico + password)
**2.** AuthService consulta a Data API com INTERNAL_API_KEY para recuperar o documento completo (incluindo passwordHash)
**3.** BCrypt.Verify valida a password. Se falhar → HTTP 401 imediato
**4.** Em caso de sucesso, gera token JWT assinado com HMAC-SHA256, válido 8 horas. Claims: jti (UUID único), id, nome, cargo (e email para clientes)
**5.** O token é emitido em dois locais: cookie HttpOnly (inacessível ao JavaScript, resistente a XSS) e corpo da resposta. O jti é registado na lista branca da TokenListService.
**6.** Em cada pedido protegido, o middleware JwtBearer valida assinatura, issuer, audience, expiração E verifica se o jti está na lista branca (e não na lista negra)
**7.** No logout: jti movido da lista branca para a lista negra + cookie eliminado + cache TanStack Query limpa. O token fica inválido imediatamente, mesmo que ainda não tenha expirado.

**Por que cookies HttpOnly em vez de localStorage?**
localStorage é vulnerável a XSS — qualquer script malicioso injetado na página pode ler o token. Cookies HttpOnly são inacessíveis ao JavaScript do browser. Esta foi uma melhoria implementada durante o desenvolvimento após identificar a vulnerabilidade.

**O que é o jti e por que é necessário?**
JWT é stateless por design — não há forma nativa de invalidar um token antes do prazo. O jti (JWT ID) é um identificador único de cada emissão de token. Ao manter uma lista branca/negra em memória, conseguimos revogar um token específico sem afetar outros tokens válidos do mesmo utilizador. A TokenListService faz limpeza automática de entradas expiradas a cada 10 minutos para não crescer indefinidamente.

---

## 2.6 RBAC — Controlo de Acesso Baseado em Funções

| Perfil | Módulo de Frontend | Permissões |
|---|---|---|
| CLIENTE | /FixNRide/* | Agendar, trotinetes, catálogo, faturas |
| OPERADOR | /FixNSell/* | Vendas, levantamentos, encomendas, faturas |
| MECANICO | /FixNRepair/* | Agenda, intervenções, estado de serviços |
| ADMINISTRADOR | /FixNManage/* + tudo acima | Gestão total: utilizadores, stock, promoções, dashboard |

**Validação dupla:**
- No frontend: componente ProtectedRoute verifica o cargo extraído do token JWT
- No backend: atributo [Authorize(Roles="...")] em cada endpoint

**Por que dupla validação e não só no backend?**
A validação no frontend não é segurança — é UX. Redirecionar para /auth ao detetar token inválido ou cargo errado é mais rápido e melhor para a experiência. Mas se alguém manipular o frontend, o backend rejeita o pedido de qualquer forma. A segurança real está no servidor.

---

## 2.7 Comunicação HTTP entre .NET e Data API

**Mecanismo:** Typed HttpClient do ASP.NET Core, configurado centralmente no Program.cs via `ConfigureDefaultClient`.

**Dois aspetos configurados automaticamente em cada chamada:**
1. Endereço base: lido de DATA_API_URL (http://data-api:3001 na rede Docker interna). Se ausente no arranque → exceção imediata (fail-fast).
2. Cabeçalho x-api-key com a INTERNAL_API_KEY — adicionado a todos os pedidos sem intervenção manual nos serviços.

**Tratamento de erros:** cada chamada verifica IsSuccessStatusCode. Falha → devolve null ou coleção vazia ao Controller, que traduz em resposta HTTP semântica (404 Not Found, 400 Bad Request).

**Orquestração paralela:** em operações que precisam de dados de múltiplas coleções, o EncomendaClienteService usa Task.WhenAll para chamadas paralelas, reduzindo latência total face a chamadas sequenciais.

---

## 2.8 Arquitetura da Base de Dados — Estratégias de Modelação

**Embedding vs Referencing — o critério de decisão:**
Três perguntas: (1) os dados têm existência útil fora do documento pai? (2) Qual é a cardinalidade? (3) Os dados são acedidos independentemente?

**Casos de Embedding (dados sem existência autónoma):**
- Fatura ⊃ devoluções: uma devolução não existe nem faz sentido sem a fatura que a originou
- Serviço ⊃ historicoIntervencoes ⊃ pecasUtilizadas: dois níveis de aninhamento; a leitura de um serviço precisa sempre de todos estes dados → um único findById
- Venda ⊃ itensVenda: itens não têm existência autónoma fora da venda
- Promoção ⊃ pecasAplicaveisIds: array de EANs de baixa cardinalidade

**Casos de Referencing (entidades com vida própria):**
- Trotinete → Cliente (por NIF): cliente existe em múltiplos contextos (autenticação, faturação, perfil)
- Serviço → Trotinete: a trotinete tem estado próprio (emServico) e é gerida independentemente
- Fatura → Serviço/Venda: mutuamente exclusivos; permite navegar o histórico em qualquer direção
- Agenda → Funcionario/Servico: entidades completamente independentes

**12 coleções MongoDB:**
clientes, funcionarios, trotinetes, servicos, agenda, intervencoes_catalogo, faturas, vendas, promocoes, pecas, encomendas_stock, encomendas_cliente

---

## 2.9 Diagramas de Sequência — Fluxos Críticos

**Levantamento de Trotinete (o mais complexo):**
```
Frontend → PUT /api/Servicos/{id}/levantar
  ServicoService.LevantarComFaturaAsync:
    1. GET /servicos/{id} (Data API) — verificar CONCLUIDO
    2. GET /trotinetes/{numSerie} — obter clienteId (NIF)
    3. POST /faturas (Data API) — criar fatura com total calculado
    4. PUT /servicos/{id} (Data API) — estado FECHADO
  → Retorna LevantamentoComFaturaDto ao frontend
```
Por que este fluxo é atómico? Se qualquer passo falhar, o processo para e devolve erro. Não há fatura sem serviço fechado, nem serviço fechado sem fatura — garantindo consistência financeira.

**Venda Direta (recalculo no servidor):**
O total é calculado no servidor com base no PVP atual e promoções ativas — nunca aceite do frontend. Esta decisão impede que um utilizador manipule preços no cliente React antes de submeter. O servidor é a única fonte de verdade para valores monetários.

---

## 2.10 Arquitetura do Frontend — SPA com React Router

**React Router v6 — Rotas Aninhadas e Outlet:**
Cada módulo tem uma rota pai que define o layout partilhado (sidebar, header) e rotas filho que renderizam o conteúdo específico dentro do `<Outlet />`. O layout é instanciado uma única vez — não há re-renderização ao navegar entre subpáginas do mesmo módulo.

**Quatro portais distintos:**
- /FixNRide: cliente, mobile-first, bottom navigation bar, estética azul/roxo
- /FixNSell: operador, desktop-first, sidebar lateral fixa
- /FixNRepair: mecânico, design denso em informação, painéis lado a lado
- /FixNManage: administrador, sidebar lateral, dashboard com gráficos

**Instância Axios centralizada:**
Definida em src/services/api.js com baseURL e interceptor que injeta automaticamente o token JWT no cabeçalho Authorization de todos os pedidos. Elimina gestão manual de autenticação em cada chamada.

---

# ETAPA 3 — IMPLEMENTAÇÃO ASSISTIDA POR LLM

## 3.1 Modelo Utilizado e Porquê

O modelo utilizado foi o Claude Sonnet 4.6 (Anthropic), acedido via extensão Claude Code no VS Code. Escolha justificada por: raciocínio técnico estruturado, qualidade de código em JavaScript, C# e JSX, capacidade de manter coerência arquitetural em sessões longas.

---

## 3.2 O Problema da Janela de Contexto

**O que é a janela de contexto?**
O volume máximo de informação (tokens) que um LLM consegue processar numa única sessão. Quando o contexto é excedido ou degradado, o modelo começa a produzir código incoerente com o que foi definido anteriormente — "alucina" nomes de endpoints, contratos de DTOs ou estruturas de dados.

**Como se manifestou no Fix'n'Ride:**
Quando se tentava implementar o módulo completo de Serviços de Reparação numa única sessão (que envolve as coleções servicos, agenda, pecas, faturas e funcionarios), o modelo começava a gerar endpoints com nomes que não correspondiam aos Schemas, campos de DTOs que contradiziam contratos estabelecidos no início da sessão.

---

## 3.3 Taxonomia de Sessões — A Solução

**Três tipos de sessão:**

**Sessões de camada:** decisões arquiteturais transversais a toda uma camada (estrutura de pastas, padrão de autenticação, formato de resposta de erro padronizado). Realizadas uma vez por camada no início da implementação.

**Sessões de módulo:** um domínio funcional dentro de uma camada. Exemplo: o módulo de Stocks da Data API numa sessão; o módulo Financeiro noutra. Cada sessão recebia apenas os Schemas e contratos relevantes para aquele domínio.

**Sessões de correção:** curtas e cirúrgicas. Contexto mínimo: snippet problemático + mensagem de erro + contrato esperado. A restrição "correção mínima, sem alterar a estrutura geral" foi fundamental para evitar que o modelo propusesse refatorações mais amplas que criavam novos problemas.

---

## 3.4 Estrutura do System Brief (Prompt de Contexto)

Cada sessão de módulo começava com um prompt estruturado com 5 secções fixas:
1. Arquitetura global do sistema e papel do serviço a implementar
2. Schemas Mongoose ou DTOs relevantes (colados diretamente)
3. Lista de endpoints da Data API disponíveis para consumo
4. Regras de negócio do módulo (extraídas dos Casos de Uso)
5. Restrições explícitas: sem acesso direto ao MongoDB pelo .NET, formato de erros, padrão de autenticação

Esta estrutura tornava cada sessão completamente autónoma — sem depender de memória de sessões anteriores.

---

## 3.5 Geração dos Schemas Mongoose

**Prompt tipo:**
"Tens o seguinte dicionário de entidades [...]. Gera o Schema Mongoose para a entidade [X], respeitando: (1) referências para relacionamentos entre coleções separadas; (2) subdocumentos embutidos para entidades sem existência independente; (3) validações obrigatórias e de formato; (4) timestamps automáticos; (5) índices de performance nos campos mais consultados."

**Problema recorrente:** o modelo tendia a normalizar excessivamente, propondo referências externas para entidades que deveriam ser embutidas. O historicoIntervencoes do Serviço foi proposto como coleção separada na primeira iteração — contrariando a estratégia de agregação definida pela equipa. Corrigido numa sessão de refinamento dedicada.

**Entidades que exigiram mais iterações:** Servico (dois níveis de aninhamento) e Fatura (subdocumento de devoluções com nota de crédito).

---

## 3.6 Geração dos Controllers e Services .NET

**O que correu melhor:** a lógica de orquestração complexa. O fluxo de levantamento de trotinete (verificação de estado, cálculo de totais, emissão de fatura, transição de estado) foi produzido como base funcional em poucos minutos, refinado em 2 iterações.

**O que exigiu mais correções:**
- Granularidade dos Roles de autorização: o modelo definia [Authorize] sem Roles específicos ou definia roles demasiado permissivos
- Validação de ModelState: frequentemente omitida nas primeiras iterações
- Renovação de tokens por expiração: não contemplada no prompt inicial, adicionada manualmente

**Divergências entre camadas:** O maior risco foi enums de estado (MongoDB guardava strings; .NET esperava int na primeira versão) e formatos de data (MongoDB devolvia Date; .NET esperava string ISO 8601). Mitigado gerando DTOs .NET na mesma sessão em que se finalizavam os controllers da Data API para esse módulo.

---

## 3.7 Geração de Componentes React

**O que correu melhor:** integração com TanStack Query. O modelo demonstrou domínio das hooks useQuery e useMutation, gerando componentes com invalidação correta de queries após mutações e estados de loading/erro adequados.

**Problemas nos formulários (exigiram 3 iterações típicas):**
- 1ª iteração: estrutura e campos
- 2ª iteração: validação e gestão de erros do servidor
- 3ª iteração: feedback visual (loading, desativação do botão, mensagens de sucesso)

**Decisão de segurança durante a implementação:** a primeira versão do roteamento armazenava o token JWT em localStorage. A equipa migrou para cookies HttpOnly, exigindo sessão de correção simultânea no frontend (remoção do armazenamento explícito) e no servidor .NET (emissão do cookie na resposta de autenticação).

---

## 3.8 Ferramenta Antigravity (Google DeepMind)

Utilizada para tarefas que beneficiam de acesso ao repositório completo:
- Scaffolding de múltiplos ficheiros em simultâneo (Schema + Controller numa sessão)
- Refatoração multi-ficheiro: a função parseJwt estava duplicada em 5 componentes → Antigravity identificou todas as ocorrências, criou src/utils/auth.js e substituiu as instâncias automaticamente
- Validação de coerência entre código implementado e documentação no relatório → identificou 3 endpoints não documentados

---

# ETAPA 4 — VERIFICAÇÃO, VALIDAÇÃO E QUALIDADE

## 4.1 Estratégia de Testes

**Decisão explícita:** sem testes unitários automatizados. Esta foi uma decisão documentada, não uma omissão, baseada numa análise custo-benefício por camada:

- **Data API:** controllers são mapeamentos simples entre pedidos HTTP e operações Mongoose. Testar em isolamento exigiria mockar o Mongoose inteiramente — o teste verificaria o mock, não a aplicação. Valor informativo marginal.
- **Servidor .NET:** controllers são delegadores puros. Os Services com lógica complexa (ServicoService.LevantarComFaturaAsync) são candidatos legítimos a testes unitários — identificado como **trabalho futuro de prioridade média**.

**Estratégia adotada:** investir nos testes de integração ponta-a-ponta, que demonstraram maior capacidade de detetar inconsistências de contrato entre camadas.

---

## 4.2 Testes de Integração — Coleção Postman

**Coleção:** MobiFix - Data API (Testes Completos).postman_collection.json

**O que cada teste valida:**
- Código de estado HTTP correto (200, 201, 400, 401, 404, 409)
- Estrutura do DTO de resposta (presença de campos obrigatórios)
- Em criações: consistência dos dados retornados com os enviados
- Ordem de execução dependente das referências (Funcionários → Clientes → Trotinetes → Peças → Serviços...)

**24 Casos de Teste documentados — os mais importantes:**

| TC | Módulo | O que testa |
|---|---|---|
| TC01 | Auth | Login com credenciais válidas → 200 + JWT |
| TC02 | Auth | Password incorreta → 401 |
| TC04 | Auth | Registo com NIF duplicado → 409 Conflict |
| TC05 | Auth | Acesso à Data API sem INTERNAL_API_KEY → 403 Forbidden |
| TC06 | Auth | Rota LN sem token JWT → 401 |
| TC08 | Utilizadores | Email duplicado → 400 |
| TC11 | Serviços | Criar diagnóstico com trotinete inexistente → 400 |
| TC14 | Serviços | Levantamento de serviço não concluído → 400 |
| TC15 | Serviços | Levantamento com serviço CONCLUIDO → 200 + fatura emitida + estado FECHADO |
| TC19 | Stocks | Encomenda inexistente → 404 |
| TC21 | Finanças | Venda direta com fatura → 200 + VendaComFaturaDto |
| TC23 | Segurança | Cliente acede a rota de admin → redireciona para /auth |
| TC24 | Segurança | Token expirado → 401 |

**Edge cases sugeridos pela IA:** tentativas de acesso sem token, NIF com formato inválido, criação de serviço para trotinete inexistente, tentativa de levantamento de trotinete em estado EXECUCAO.

---

## 4.3 Testes de Stress — Postman Performance

**Três cenários de carga progressiva:**

| Cenário | VUs | Duração | P50 | P95 | P99 | Taxa Erro |
|---|---|---|---|---|---|---|
| Carga Base | 5 | 1 min | <4ms | <5ms | <11ms | 0% |
| Carga Moderada | 20 | 2 min | <16ms | <19ms | <31ms | 0% |
| Carga de Pico | 50 | 2 min | <39ms | <46ms | <76ms | <2% |

**O que significa P50/P95/P99?**
- P50: metade dos pedidos responderam abaixo deste valor (mediana)
- P95: 95% dos pedidos responderam abaixo deste valor (ignora os 5% mais lentos)
- P99: 99% dos pedidos responderam abaixo deste valor (inclui quase tudo)
O P95 é o mais relevante para SLAs — garante que quase todos os utilizadores têm boa experiência.

**Análise dos resultados:**
- Todos os cenários satisfazem o RNF-01 (≤ 2 segundos) com margem enorme
- Com 50 VUs, taxa de erro <2% causada por timeouts ocasionais no pool de conexões MongoDB — não compromete a escala real da MobiFix
- Os índices MongoDB e o caching TanStack Query absorvem eficazmente a concorrência nos níveis normais de operação

---

## 4.4 Avaliação ISO/IEC 25010

**O que é o modelo ISO/IEC 25010?**
Modelo normativo internacional de qualidade de produto de software com 8 características principais. Permite avaliar e comparar sistemas de forma estruturada.

**Avaliação do Fix'n'Ride:**

| Característica | Classificação | Evidência Principal |
|---|---|---|
| Adequação Funcional | Alta | 22/22 RF implementados e validados |
| Fiabilidade | Moderada | Fail-fast no arranque; sem retry inter-serviços; erros residuais a 50 VUs |
| Usabilidade | Boa | Interfaces contextuais por perfil; alert() nativo pendente de substituição por toasts |
| Eficiência de Performance | Adequada | P95 < 46ms a 50 VUs; muito abaixo dos 2s do RNF-01 |
| Manutenibilidade | Boa | Arquitetura modular; parseJwt duplicado pendente de refactorização |
| Segurança | Alta | BCrypt, JWT/HMAC-SHA256, cookies HttpOnly, CORS restrito, INTERNAL_API_KEY |
| Portabilidade | Alta | Contentorização Docker total; independente do SO host |
| Compatibilidade | Boa | API REST/JSON; SPA compatível com browsers modernos |

**Por que Fiabilidade fica apenas Moderada?**
Ausência de mecanismo de retry nas chamadas HTTP inter-serviços (LN → Data API). Uma falha transitória na rede Docker interna resulta em erro imediato para o utilizador, sem nova tentativa automática. Em produção seria prioritário implementar retry com backoff exponencial.

---

## 4.5 Code Smells Identificados e Refactorizações

**Smell 1 — Código Duplicado: parseJwt em 5 locais**
Causa: LLMs geram código contextualmente auto-suficiente sem memória do projeto global. Cada sessão gerou a sua própria cópia da função.
Refactorização: extraída para src/utils/auth.js com funções getAuthPayload(), getOperadorNumero() e logout().

**Smell 2 — alert() Nativo em Múltiplos Hooks**
Causa: solução provisória típica de código gerado por IA — funcional mas com UX degradada (bloqueia a interface, aparência inconsistente).
Refactorização parcial: módulo do mecânico migrado para toasts da biblioteca sonner. Restantes módulos ficam como trabalho futuro.

**Smell 3 — Mapeamento Defensivo Excessivo (o.PecaEAN || o.pecaEAN)**
Causa: incerteza do modelo sobre se o contrato da API usa PascalCase ou camelCase.
Solução: standardizar todas as respostas da API LN para PascalCase (configurado no Program.cs) e eliminar os mapeamentos defensivos.

---

## 4.6 Verificação dos Requisitos do SRS

Todos os 22 requisitos funcionais foram verificados e validados. O relatório inclui uma tabela cruzada entre cada requisito e a evidência de implementação (caso de teste ou validação manual por perfil). Exemplos de cumprimento integral:
- RF-15 (guia de reparação): implementado e gerado em PDF via jsPDF
- RF-21 (levantamento atómico): validado pelo TC-15 (serviço CONCLUIDO → fatura emitida + estado FECHADO num único pedido)
- RF-22 (devolução): nota de crédito embutida como subdocumento na fatura original; stock reposto automaticamente

---

# REFLEXÃO CRÍTICA SOBRE O USO DE LLMs (TRANSVERSAL A TODAS AS ETAPAS)

## Vantagens Documentadas

**Aceleração:** redução estimada de 40-50% no tempo de implementação de funcionalidades padrão (CRUD, autenticação, roteamento).

**Qualidade estrutural consistente:** o código do Claude Sonnet 4.6 apresentou sistematicamente nomes semânticos, separação de responsabilidades, comentários nos pontos relevantes e aderência às convenções de cada linguagem.

**Transferência de conhecimento implícita:** a capacidade de questionar o modelo sobre as suas opções de implementação ("porque usaste Promise.all aqui?") funcionou como mecanismo de aprendizagem acelerada.

**Deteção proativa de lacunas:** em várias ocasiões, o modelo identificou ambiguidades na especificação fornecida antes de proceder à geração — casos extremos não cobertos pelos Casos de Uso, conflitos entre regras de negócio.

## Limitações e Riscos

**Dependência crítica da qualidade do prompt:** prompts vagos produzem código genérico. A engenharia de prompts é uma competência não trivial que exige domínio técnico prévio do domínio.

**Alucinações e código plausível mas incorreto:** o risco mais insidioso. O modelo gerou código que compila mas implementa lógica subtilmente errada (e.g., endpoints com nomes que não correspondiam aos definidos, cálculo de totais com promoções incorreto em casos extremos). Só detetável com testes de integração rigorosos.

**Tendência para soluções genéricas:** normalização excessiva dos schemas MongoDB, sugestão de OAuth em vez de JWT simples, SQL Server em vez de MongoDB. O modelo propõe soluções padrão da indústria que não se adequam às especificidades do domínio.

**Ausência de visão sistémica:** o modelo opera dentro dos limites do contexto de cada sessão. Não vê o impacto de uma decisão num módulo sobre o comportamento de outro módulo numa sessão diferente. A equipa é o único agente com visão global do projeto.

## A Fronteira Metodológica Estabelecida

**O que a IA fez:**
- Transformou notas da equipa em texto documentado
- Gerou código estrutural (CRUD, DTOs, componentes React)
- Sugeriu edge cases para testes
- Acelerou o handoff design-código

**O que a IA NÃO fez (e não devia fazer):**
- Identificar ou levantar requisitos
- Desenhar diagramas UML (todos foram desenhados pela equipa)
- Tomar decisões arquiteturais (MongoDB vs SQL, separação de camadas)
- Validar coerência global do sistema

**Conclusão central:** a IA não substitui o engenheiro de software — substitui a parte mecânica e repetitiva da implementação. O julgamento técnico, a visão sistémica, a decisão arquitetural e a validação rigorosa permanecem responsabilidades irredutíveis da equipa humana.

---

# PERGUNTAS DIFÍCEIS QUE PODES RECEBER

**"A separação em dois servidores de backend não é over-engineering para o contexto académico?"**
Não. Demonstra precisamente a aplicação consciente do princípio de Separation of Concerns, que é um dos objetivos declarados do enunciado ("produzir peças de software comparáveis a projetos de nível profissional"). A separação foi validada pelos testes — a testabilidade independente da Data API via Postman só foi possível porque ela está completamente isolada da lógica de negócio.

**"Como garantem que o código gerado pela IA é realmente vosso e que o compreendem?"**
Cada decisão arquitetural foi tomada pela equipa antes de qualquer interação com IA. O system brief de cada sessão foi construído pela equipa. O código gerado foi revisto, corrigido e testado pela equipa. Os code smells foram identificados e documentados com análise crítica. E as decisões onde a IA divergiu da equipa (embedding vs referencing, JWT simples vs OAuth) foram corrigidas com justificação explícita no relatório.

**"Porque não usaram testes automatizados com cobertura de código?"**
A resposta não é "não tivemos tempo". É uma decisão técnica documentada: dada a natureza da arquitetura (controllers delegadores, acesso a base de dados como lógica central), os testes de integração ponta-a-ponta têm maior poder de deteção de erros reais do que testes unitários com mocking extensivo. A lacuna dos Services .NET complexos está reconhecida como trabalho futuro de prioridade média.

**"O que faria diferente se tivesse mais tempo?"**
1. Testes unitários para os Services .NET com lógica de orquestração complexa (ServicoService, FaturaService)
2. Mecanismo de retry nas chamadas HTTP inter-serviços
3. Substituição completa dos alert() por toasts da sonner em todos os módulos
4. Implementação de refresh tokens (o access token atual de 8h não é renovável automaticamente)
5. Envio real de emails (o subsistema de email está estruturado mas não envia)

**"MongoDB foi realmente a escolha certa? Não perderam integridade referencial?"**
A integridade referencial em SQL resolve-se com foreign keys e constraints. Em MongoDB, resolve-se com Mongoose (validações a nível de aplicação), índices de unicidade, e disciplina arquitetural (a Lógica de Negócios verifica referências antes de criar documentos). A troca é consciente: perdemos garantias automáticas de integridade, ganhamos representação nativa de dados hierárquicos e performance em leituras agregadas. Para o domínio específico da MobiFix, a troca é favorável.
