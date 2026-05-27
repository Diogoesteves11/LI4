# Guião de Apresentação Oral — Fix'n'Ride
### Laboratórios de Informática IV | Apresentação ~5 min + 20 min perguntas

---

> **Como usar este guião**
> O texto em *itálico* é o que dizes em voz alta. As indicações entre [colchetes] são notas de orientação para ti. Cada bloco tem duração estimada.

---

## ABERTURA — Contextualização e Problema (≈ 45 seg)

*"Bom dia. O nosso projeto chama-se Fix'n'Ride, e foi desenvolvido para a MobiFix — uma oficina de reparação de trotinetes elétricas que cresceu muito rapidamente, mas que continuava a gerir tudo com papel e folhas de cálculo. O problema central é simples: quando o volume de clientes aumentou, o caos instalou-se. Os mecânicos perdiam fichas de reparação, o stock batia certo mas as peças não estavam lá, e a administradora não conseguia saber no final do mês se a oficina estava a ser rentável. A nossa solução foi digitalizar todo o ciclo operacional da oficina numa única plataforma web."*

---

## O QUE O SISTEMA FAZ — Visão Funcional (≈ 1 min)

*"O Fix'n'Ride cobre quatro perfis de utilizador: o Cliente, o Mecânico, o Operador de Loja e o Administrador.*

*Do ponto de vista do cliente, é possível agendar um diagnóstico online, acompanhar o estado da reparação em tempo real e reservar peças pelo catálogo com levantamento em loja — o que chamamos Click & Collect.*

*O mecânico tem um tablet na bancada onde consulta a agenda, regista o diagnóstico, seleciona as intervenções a partir de um catálogo com preços fixos e regista o código EAN de cada peça utilizada. Quando termina, o sistema avisa automaticamente o cliente por email.*

*O operador processa a venda direta ao balcão, faz o levantamento das trotinetes concluídas com emissão automática de fatura, e gere devoluções.*

*E a administradora tem um dashboard com KPIs financeiros, aprova encomendas de reposição de stock, gere promoções e controla a equipa."*

---

## ARQUITETURA — Decisões Técnicas-Chave (≈ 1 min 30 seg)

*"Do ponto de vista técnico, a decisão arquitetural mais relevante foi separar o sistema em três camadas independentes, cada uma num contentor Docker.*

*A camada de dados é uma Data API em Node.js com MongoDB. Escolhemos MongoDB porque as entidades do domínio são naturalmente hierárquicas — um serviço de reparação contém um histórico de intervenções, que por sua vez contém as peças utilizadas e os timestamps. Em SQL precisaríamos de pelo menos três tabelas e JOINs em cada leitura. Em MongoDB é um único documento.*

*A lógica de negócio corre num servidor ASP.NET Core em .NET 8, separado deliberadamente da camada de dados. Toda a autenticação JWT, o hashing de passwords com BCrypt e os processos complexos como a emissão atómica de faturas vivem aqui. A separação impede que o frontend aceda diretamente à base de dados.*

*O frontend é uma SPA em React com TanStack Query, organizada em quatro portais distintos por perfil — cada um com rotas protegidas pelo cargo que vem no token JWT.*

*A comunicação entre o servidor .NET e a Data API é autenticada por uma chave de API interna, garantindo que a base de dados nunca fica exposta diretamente à internet."*

---

## QUALIDADE E TESTES (≈ 45 seg)

*"Em termos de validação, fizemos testes de integração manuais com Postman cobrindo todos os módulos — 24 casos de teste documentados, todos passaram. Corremos também testes de stress com 5, 20 e 50 utilizadores virtuais em simultâneo. Com 50 VUs o P95 ficou abaixo de 50 milissegundos na Data API, muito dentro do requisito não funcional de 2 segundos.*

*A avaliação segundo ISO/IEC 25010 deu-nos classificação alta em Adequação Funcional, Segurança e Portabilidade. As áreas de melhoria identificadas — ausência de testes unitários automatizados e alguns code smells deixados pelo código gerado por IA — ficam documentadas como trabalho futuro."*

---

## USO DE IA — Reflexão (≈ 45 seg)

*"Uma componente central deste projeto foi o uso sistemático de LLMs no desenvolvimento — em particular o Claude Sonnet 4.6. Usámos IA em todas as fases: na documentação de requisitos, na geração de código, e até na sugestão de edge cases para os testes.*

*A estratégia que desenvolvemos foi fragmentar o trabalho em sessões isoladas por microsserviço, com um 'system brief' estruturado no início de cada sessão. Isso evitou as inconsistências que surgiam quando tentávamos gerar múltiplas camadas numa única conversa.*

*A conclusão mais importante é que a IA acelerou a parte mecânica — scaffolding, CRUD, componentes repetitivos — mas o julgamento técnico, as decisões arquiteturais e a validação da coerência global foram sempre responsabilidade da equipa. A IA não identificou nenhum requisito nem desenhou nenhum diagrama UML."*

---

## FECHO (≈ 15 seg)

*"Em síntese, o Fix'n'Ride é um sistema de gestão completo para a MobiFix, com todos os 22 requisitos funcionais implementados e validados, arquitetura de três camadas em Docker, e uma reflexão honesta sobre os limites e vantagens do desenvolvimento assistido por IA. Estamos disponíveis para as vossas perguntas."*

---

---

# PREPARAÇÃO PARA AS PERGUNTAS (20 min)

> Esta secção organiza as perguntas mais prováveis por tema. Para cada uma, tens a resposta preparada e os pormenores do relatório onde podes apoiar-te.

---

## TEMA 1: REQUISITOS E ENGENHARIA DE REQUISITOS

**P: Como fizeram o levantamento de requisitos? Que métodos usaram?**
> Usámos três métodos complementares: questionários de formato livre enviados a operadores e clientes; observação direta dos fluxos de trabalho na oficina; e entrevistas estruturadas com os três stakeholders internos — a administradora Ana, o operador João e o mecânico Pedro. Cada entrevista teve um objetivo específico: a Ana focou-nos nas métricas financeiras e controlo de stock; o João nos problemas do atendimento ao balcão; o Pedro nos bloqueios do registo manual em papel.

**P: Quantos requisitos especificaram? Como os priorizaram?**
> 22 requisitos funcionais e 5 não funcionais. A priorização foi feita pela criticidade do fluxo operacional — os requisitos de autenticação, gestão de serviços e faturação eram bloqueantes para tudo o resto, por isso foram implementados primeiro.

**P: Houve requisitos ambíguos? Como os trataram?**
> Sim. Por exemplo, "o sistema deve ser rápido" foi refinado para "o tempo de resposta para leituras na base de dados não deve exceder 2 segundos em condições normais de rede". "Controlar melhor o stock" tornou-se na geração automática de ordens de encomenda pendentes ao atingir o stock mínimo, com aprovação manual da administração. Documentámos esse processo de refinamento numa tabela específica no relatório.

**P: As entrevistas foram reais ou simuladas?**
> Foram simuladas — a MobiFix é um caso de estudo fictício. Mas foram estruturadas com base em cenários reais de oficinas de reparação, como a Norauto, para garantir que os requisitos refletem restrições operacionais reais e não apenas o que parecia lógico numa sala.

---

## TEMA 2: ARQUITETURA E DECISÕES TÉCNICAS

**P: Porque separaram a Data API da Lógica de Negócios em dois servidores distintos? Não é over-engineering?**
> Há quatro razões concretas. Primeiro, a complexidade das regras de negócio: o levantamento de uma trotinete envolve quatro passos coordenados — verificar o estado do serviço, determinar o cliente proprietário, emitir a fatura, fechar o serviço — tudo numa sequência atómica. Essa orquestração não pode ficar no frontend. Segundo, segurança: a base de dados nunca fica exposta diretamente. Terceiro, adequação tecnológica: o .NET tem injeção de dependências nativa, JWT integrado e tipagem estática que o Node.js não oferece da mesma forma. Quarto, escalabilidade independente por camada.

**P: Porque MongoDB em vez de SQL?**
> Pela natureza hierárquica das entidades. Um Serviço contém um array de intervenções, cada intervenção contém um array de peças utilizadas com timestamps. Em SQL precisaríamos de pelo menos três tabelas e JOINs complexos em cada leitura. Com MongoDB, tudo isso fica num único documento — a leitura é uma operação findById. Usámos Mongoose para garantir validação de esquema e evitar os riscos de inconsistência tipicamente associados ao NoSQL.

**P: Que padrões arquiteturais usaram?**
> MVC em ambos os servidores de backend. Na Data API, os Controllers recebem pedidos HTTP e delegam para o Mongoose. No servidor .NET, os Controllers delegam para Services, que encapsulam a lógica de negócio. No frontend, TanStack Query separa a camada de comunicação com a API da camada de renderização. Toda a organização é modular por domínio funcional — autenticação, serviços, stocks, finanças, catálogos.

**P: Como garantiram a segurança inter-serviços?**
> Com uma INTERNAL_API_KEY partilhada entre o servidor .NET e a Data API, injetada como variável de ambiente. O servidor .NET adiciona esta chave automaticamente a todos os pedidos para a Data API. A Data API recusa qualquer pedido sem essa chave, mesmo que venha de dentro da rede Docker. Isso garante que a Data API nunca é acessível diretamente, nem mesmo por outro serviço não autorizado dentro do mesmo ambiente.

**P: Como funciona a autenticação? Explicar o fluxo JWT.**
> O utilizador submete credenciais. O servidor .NET verifica a password com BCrypt, gera um token JWT assinado com HMAC-SHA256, válido por 8 horas, com claims de identidade e cargo. O token é emitido tanto no corpo da resposta como num cookie HttpOnly — essa foi uma melhoria que fizemos durante o desenvolvimento, para mitigar riscos de XSS. O middleware JwtBearer valida assinatura, issuer e expiração em cada pedido. Para revogar tokens antes do prazo, implementámos um serviço de lista branca/negra em memória baseado no jti de cada token.

---

## TEMA 3: BASE DE DADOS E MODELAÇÃO

**P: Expliquem a diferença entre Embedding e Referencing no MongoDB e como decidiram em cada caso.**
> O critério foi simples: se a entidade não tem existência útil fora do documento pai, embute-se. Se existe de forma autónoma, usa-se referência. Por exemplo, as devoluções de uma fatura são subdocumentos embutidos — uma devolução não existe sem a fatura que a originou. Já o Cliente é referenciado pela Trotinete via NIF — o cliente existe de forma autónoma em múltiplos contextos (autenticação, faturação, perfil). O histórico de intervenções de um serviço é o caso mais complexo: dois níveis de aninhamento — Serviço contém intervenções, que contêm peças utilizadas — tudo embutido porque a leitura de um serviço precisa de todos esses dados ao mesmo tempo.

**P: Quantas coleções têm na base de dados?**
> Doze: clientes, funcionarios, trotinetes, servicos, agenda, intervencoes_catalogo, faturas, vendas, promocoes, pecas, encomendas_stock, encomendas_cliente.

**P: Como garantiram a integridade dos dados sem as constraints do SQL?**
> Com Mongoose, que adiciona validações declarativas ao nível da aplicação: campos required, enums de estado, valores mínimos, unicidade via índices. Criámos índices de unicidade para email e NIF de clientes, e índices de performance nos campos de filtragem mais frequentes — como estado dos serviços e mecanicoId na agenda. O script init.sh cria todos esses índices automaticamente no primeiro arranque.

---

## TEMA 4: FRONTEND

**P: Porque usaram TanStack Query? O que acrescenta face ao useState normal?**
> Resolve três problemas de uma vez: caching automático com staleness configurável por domínio (peças que mudam frequentemente têm staleTime de 1ms; faturas históricas têm 5 minutos); sincronização com o servidor depois de mutações via invalidateQueries; e gestão declarativa dos estados de loading e erro sem boilerplate manual. Sem TanStack Query, teríamos useEffect e useState em cada componente para gerir pedidos, o que rapidamente se torna difícil de manter.

**P: Como funciona a proteção de rotas por perfil?**
> O componente ProtectedRoute verifica a presença e validade do token JWT antes de renderizar qualquer rota privada. Extrai o campo cargo do token e compara com o array allowedRoles definido para cada rota. Um cliente com token CLIENTE que tente aceder a /FixNManage é redirecionado para /auth. Esta validação acontece também no servidor em cada endpoint via o atributo [Authorize(Roles="...")].

---

## TEMA 5: TESTES E QUALIDADE

**P: Porque não fizeram testes unitários automatizados?**
> Foi uma decisão explícita documentada no relatório, baseada numa análise custo-benefício por camada. Na Data API, os controllers são essencialmente mapeamentos entre pedidos HTTP e operações Mongoose — testar em isolamento exigiria mockar o Mongoose inteiramente, o que testa o mock e não a aplicação. No .NET, os controllers são delegadores puros. Reconhecemos que os Services .NET com lógica complexa — como o fluxo de levantamento — são candidatos legítimos a testes unitários e isso está documentado como trabalho futuro de prioridade média.

**P: O que mostraram os testes de stress?**
> Com 5 VUs (carga base, simula uso normal), P95 abaixo de 5ms. Com 20 VUs (pico operacional normal), P95 abaixo de 19ms e taxa de erro nula. Com 50 VUs, P95 abaixo de 46ms e taxa de erro residual inferior a 2%, causada por timeouts ocasionais no pool de conexões MongoDB. O requisito não funcional era 2 segundos — ficámos muito abaixo em todos os cenários.

**P: O que é a avaliação ISO/IEC 25010 e o que resultou dela?**
> É um modelo normativo de qualidade de produto de software com oito características: Adequação Funcional, Fiabilidade, Usabilidade, Eficiência de Performance, Manutenibilidade, Segurança, Portabilidade e Compatibilidade. A nossa avaliação foi qualitativa, baseada em observação do código e nos resultados dos testes. Obtivemos classificação Alta em Adequação Funcional (22/22 requisitos implementados), Segurança (BCrypt, JWT, cookies HttpOnly) e Portabilidade (contentorização Docker completa). Fiabilidade ficou em Moderada por não termos mecanismo de retry inter-serviços.

---

## TEMA 6: USO DE IA

**P: Que papel teve a IA no desenvolvimento? Onde ajudou mais e onde falhou?**
> Ajudou mais na geração de código estrutural repetitivo: schemas Mongoose, controllers CRUD, componentes React com TanStack Query. O código gerado tinha qualidade estrutural alta — nomes semânticos, separação de responsabilidades, aderência às convenções de cada linguagem. Falhou na visão sistémica: como cada sessão é isolada, o modelo tendia a produzir código localmente correto mas globalmente inconsistente. Encontrámos casos de DTOs com campos que não correspondiam aos schemas MongoDB, enums em formatos diferentes entre camadas, e code smells como a função parseJwt duplicada em cinco componentes.

**P: Como organizaram as sessões com a IA para evitar inconsistências?**
> Criámos uma taxonomia de três tipos de sessão: sessões de camada (decisões arquiteturais transversais), sessões de módulo (um domínio funcional dentro de uma camada), e sessões de correção (bugs cirúrgicos). Cada sessão começava com um "system brief" de cinco secções fixas: arquitetura global, schemas/DTOs relevantes, lista de endpoints disponíveis, regras de negócio do módulo, e restrições explícitas de implementação. Isso tornava cada sessão autónoma e produzia código imediatamente integrável.

**P: A IA identificou os requisitos do sistema?**
> Não. Este ponto é importante: a IA não identificou nem levantou nenhum requisito. O levantamento foi feito pela equipa com base em entrevistas e observação. A IA transformou as notas da equipa em texto estruturado e padronizado — acelerou a documentação, não a análise. O mesmo para os diagramas UML: nenhum diagrama foi gerado por IA. O Modelo de Domínio, os Casos de Uso, os Diagramas de Sequência — tudo foi desenhado pela equipa.

**P: Usaram o Claude para escrever o relatório?**
> Algumas secções de documentação foram geradas com assistência do Claude a partir das notas da equipa — por exemplo, a secção de contextualização, a análise de restrições e algumas introduções de capítulo. Cada prompt e o respectivo delta (o que foi alterado manualmente pela equipa) estão documentados ao longo do relatório. O conteúdo técnico — requisitos, diagramas, decisões arquiteturais — é integralmente da equipa.

---

## TEMA 7: TRABALHO FUTURO E LIMITAÇÕES

**P: Qual é a maior limitação do sistema atual?**
> A mais relevante do ponto de vista de segurança já foi mitigada durante o desenvolvimento: migramos os tokens JWT de localStorage para cookies HttpOnly, eliminando a exposição a ataques XSS. A limitação técnica mais significativa que ficou é a ausência de mecanismo de retry nas chamadas HTTP inter-serviços — uma falha transitória na rede Docker interna resulta em erro imediato para o utilizador. Em produção isso seria prioritário.

**P: O sistema está pronto para produção?**
> Com as melhorias de segurança documentadas — principalmente a suíte de testes automatizados e a implementação de refresh tokens — sim. A infraestrutura Docker já garante portabilidade. Os dados de seed permitem reconstituir o ambiente completo com um único comando. O que falta é principalmente robustez operacional e cobertura de testes, não funcionalidades em falta.

---

## DICAS FINAIS

- **Cronometras os 5 minutos** antes da apresentação real — o guião está calibrado mas a tua cadência pode variar.
- **Na secção de arquitetura**, se sentires que estás a perder o fio, resume com: *"A ideia central é que cada camada comunica apenas com a camada imediatamente abaixo, e a base de dados nunca fica exposta ao exterior."*
- **Se te perguntarem algo que não sabes**, é legítimo dizer: *"Esse detalhe específico não tenho de memória, mas está documentado no capítulo X do relatório."* Mostra que sabes onde está a informação.
- **Para perguntas sobre o MongoDB vs SQL**, a resposta-chave é sempre o exemplo concreto: *"O Serviço tem intervenções aninhadas com peças — em SQL seriam três tabelas e JOINs; em MongoDB é um findById."*
