Com base no relatório, aqui está um guião completo focado em IA e engenharia de prompts:

---

# 🤖 Guião de Preparação — IA e Engenharia de Prompts

---

## 1. NARRATIVA BASE — O que dizer se pedirem uma visão geral

> *"Ao longo de todo o projeto usámos IA generativa como amplificador de capacidade, não como substituto de engenharia. O modelo principal foi o Claude Sonnet 4.6, acedido via Claude Code no VS Code, complementado com GPT-4o, o agente Antigravity da Google DeepMind, e Figma AI para design. Cada ferramenta teve um papel distinto e bem delimitado, e em nenhuma fase a IA tomou decisões arquiteturais ou de domínio por nós."*

**Atenção:** Se o professor perguntar "mas então para que serviu a IA?", a resposta honesta é: **aceleração da escrita e estrutura**, não pensamento crítico.

---

## 2. AS QUATRO FASES DE USO — Saber explicar cada uma

### Fase 1 — Engenharia de Requisitos
**O que a IA fez:**
- Transformar notas de entrevistas em narrativas coesas
- Formatar User Stories no padrão "Como X, quero Y, para que Z"
- Redigir secções de contextualização e análise de restrições
- Sugerir edge cases de requisitos que a equipa não tinha considerado

**O que a IA NÃO fez:**
- Identificar os requisitos — isso foi feito pela equipa através de entrevistas simuladas e observação
- Desenhar os diagramas UML — Modelo de Domínio, Casos de Uso, Atividades e Sequência foram todos feitos manualmente
- Decidir as regras de negócio — ex: a aprovação obrigatória da administração nas encomendas de stock

**Frase para defender se pressionados:**
> *"A IA transformou o que nós já sabíamos em linguagem técnica clara. O conhecimento do domínio foi sempre nosso."*

---

### Fase 2 — Arquitetura e Design
**O que a IA fez:**
- Sugerir justificações para as escolhas tecnológicas depois de a equipa as ter decidido
- Gerar a tabela de decisões arquiteturais com base nos critérios que fornecemos
- Gerar descrições dos serviços Docker com base na configuração real
- Antigravity: gerar scaffolding inicial dos quatro serviços e rever a coerência do `docker-compose.yml`

**O que a IA NÃO fez:**
- Decidir separar a Data API da Lógica de Negócios — essa foi uma decisão da equipa
- Escolher MongoDB em vez de SQL Server — a equipa analisou as entidades hierárquicas e decidiu
- Produzir qualquer diagrama UML

**Delta importante a mencionar:**
> *"Quando pedimos à IA para justificar o MongoDB, ela deu argumentos genéricos sobre flexibilidade NoSQL. Tivemos de reformular o prompt com exemplos concretos do domínio, como a entidade Serviço com intervenções aninhadas, para obter uma justificação útil."*

---

### Fase 3 — Implementação
**O que a IA fez:**
- Gerar Schemas Mongoose a partir do dicionário de entidades
- Gerar controllers Express para operações CRUD
- Gerar Services e Controllers .NET com base nos DTOs e endpoints definidos
- Gerar componentes React com hooks TanStack Query
- Antigravity: refactorização multi-ficheiro do `parseJwt` disperso em 5 componentes

**Problemas recorrentes encontrados:**
- Normalização excessiva nos Schemas (propunha referências onde devia embutir)
- Respostas de erro em formatos inconsistentes entre sessões
- Formulários sem validação do lado do servidor
- `alert()` nativo em vez de toasts
- Magic strings para estados de entidades
- Geração insegura de IDs com `Random.Shared.Next`

**O que a equipa teve sempre de fazer:**
- Rever todo o código gerado antes de integrar
- Testar de ponta a ponta no Postman
- Corrigir inconsistências de contrato entre camadas geradas em sessões separadas

---

### Fase 4 — Testes e Documentação
**O que a IA fez:**
- Sugerir edge cases não contemplados (ex: levantar trotinete em estado EXECUCAO, token expirado)
- Gerar dados de seed realistas para o MongoDB
- Comparar endpoints implementados com os documentados e identificar discrepâncias

**O que a equipa teve sempre de fazer:**
- Executar os testes — a IA não tem acesso às ferramentas reais
- Interpretar os resultados e decidir correções
- Validar se os edge cases sugeridos faziam sentido no domínio

---

## 3. A ESTRATÉGIA DE SESSÕES — Explicar sem hesitar

Se o professor perguntar *"como usavam concretamente a IA?"*, esta é a resposta estruturada:

**O problema:** A janela de contexto dos LLMs é limitada. Num projeto com 4 serviços e 12 coleções, tentar gerar código de múltiplos serviços numa sessão produzia inconsistências — nomes de endpoints errados, DTOs que contradiziam os Schemas, lógica que ignorava regras já definidas.

**A solução — três tipos de sessão:**

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| Sessão de camada | Decisões arquiteturais transversais | Estrutura de pastas, padrão de erros |
| Sessão de módulo | Um domínio funcional de uma camada | Módulo de Stocks da Data API |
| Sessão de correção | Bug específico encontrado nos testes | Erro de desserialização num DTO |

**A estrutura do prompt de sessão tinha sempre 5 secções:**
1. Arquitetura global e papel do serviço
2. Schemas Mongoose ou DTOs relevantes colados diretamente
3. Lista de endpoints disponíveis para consumo
4. Regras de negócio do módulo, extraídas dos Casos de Uso
5. Restrições explícitas — ex: proibição de acesso direto ao MongoDB, formato de erros obrigatório

---

## 4. ENGENHARIA DE PROMPTS — Os padrões que usaram

### Padrão 1 — Contexto primeiro, pedido depois
Em vez de:
> *"Faz o schema do Serviço em Mongoose"*

Usavam:
> *"Tens o seguinte dicionário de entidades e tabela de relacionamentos do sistema Fix'n'Ride [...]. Gera o Schema Mongoose para a entidade Serviço, respeitando as seguintes regras: usa referências para relacionamentos entre coleções separadas; usa subdocumentos embutidos para entidades que não existem de forma independente..."*

**Por quê funciona:** O modelo tem o vocabulário do domínio antes de gerar, reduzindo alucinações.

---

### Padrão 2 — Restrições explícitas no prompt
Em vez de deixar o modelo decidir, especificavam o que era proibido:

> *"Regras obrigatórias: (1) o Service deve injetar o HttpClient via construtor; (2) todos os métodos devem ser assíncronos; (3) os Controllers devem usar `[Authorize(Roles)]` com os papéis corretos; (4) incluir validação de ModelState; (5) o tratamento de erros deve usar o padrão Result para evitar exceções não controladas."*

**Por quê funciona:** Sem restrições, o modelo escolhe o caminho mais comum — que pode não ser o correto para o vosso sistema.

---

### Padrão 3 — Correção mínima nas sessões de debug
Em vez de:
> *"Este código não funciona, corrige"*

Usavam:
> *"O seguinte código produz o erro [mensagem] quando [contexto]. O contrato esperado é [descrição]. Identifica a causa e propõe a correção mínima necessária, sem alterar a estrutura geral do código nem introduzir dependências novas."*

**Por quê funciona:** Sem a restrição "mínima", o modelo tende a refatorar tudo, introduzindo novos bugs.

---

### Padrão 4 — Exemplos concretos do domínio
Quando a IA dava justificações genéricas, reformulavam com exemplos reais:

> *"Não justifiques com argumentos genéricos sobre NoSQL. Justifica com a entidade Serviço que embute um array de intervenções, cada uma com o seu próprio array de peças e timestamps de execução."*

**Por quê funciona:** Força o modelo a raciocinar sobre o vosso sistema, não sobre um sistema hipotético.

---

### Padrão 5 — Deltas explícitos
No relatório documentaram sempre o que a IA errou e o que tiveram de corrigir. Chamaram-lhe "Deltas". Isto é importante mencionar — mostra pensamento crítico.

Exemplos de deltas reais:
- IA propôs referências externas onde devia embutir no MongoDB
- IA não contemplou a `INTERNAL_API_KEY` como mecanismo de segurança
- IA gerou inventário de endpoints incompleto na tabela do capítulo 6
- IA explicou janela de contexto de forma abstrata sem exemplos do projeto

---

## 5. LIMITAÇÕES — Não fugir a estas perguntas

**"A IA não alucia no vosso projeto?"**
> *"Sim, aluciou. O exemplo mais concreto foi na geração de endpoints — o modelo criou nomes de rotas que não correspondiam aos definidos nos Schemas. O padrão insidioso é que o código compilava e parecia correto, mas a lógica estava errada. Por isso os testes de integração foram essenciais."*

**"Podem garantir que percebem o código que a IA gerou?"**
> *"Sim. A nossa estratégia de revisão humana sistemática antes de integrar qualquer código, aliada aos testes de ponta a ponta no Postman, garantiu que nunca integramos código que não compreendíamos. Além disso, as sessões de debug — onde tínhamos de explicar o problema ao modelo — forçaram-nos a compreender o código."*

**"Qual foi o contributo real da equipa se a IA gerou o código?"**
> *"A IA gerou estrutura. A equipa definiu o domínio, a arquitetura, as regras de negócio, os contratos entre camadas, e validou tudo. É a diferença entre um arquiteto que desenha um edifício e um operário que assenta tijolos — a IA foi o operário numa parte do trabalho."*

**"A IA substitui engenheiros de software?"**
> *"Não, pelo menos não com a tecnologia atual. Fica provado no nosso projeto pela quantidade de revisão, correção e validação humana que foi necessária. A nossa conclusão no relatório é clara: a IA substitui a parte mecânica e repetitiva, não o julgamento técnico nem a visão sistémica."*

---

## 6. NÚMEROS QUE DEVEM SABER DE COR

| Facto | Valor |
|-------|-------|
| Modelo principal | Claude Sonnet 4.6 via Claude Code |
| Outros modelos | GPT-4o, Antigravity, Figma AI, GitHub Copilot |
| Redução estimada de tempo com IA | 40–50% na implementação |
| Iterações por módulo simples | 2 iterações |
| Iterações por módulo complexo | 6–8 iterações |
| Iterações médias por módulo completo | 4–5 iterações, 3–4 sessões |
| Code smells encontrados no código gerado | pelo menos 4 tipos documentados |
| Ficheiros com `parseJwt` duplicado | 5 ficheiros |
| Casos de teste sugeridos pela IA e adicionados | edge cases de TC-12, TC-14, TC-19, TC-24 |

---

## 7. PERGUNTAS ARMADILHA E COMO RESPONDER

**"Se a IA fez tudo, o que é que aprenderam?"**
> *"A interação com a IA funcionou como aprendizagem acelerada. Podíamos perguntar 'porque usaste Promise.all aqui?' e obter uma explicação imediata. Para membros da equipa menos familiarizados com certas tecnologias da stack, foi mais eficaz do que estudar documentação."*

**"O professor pode não aceitar que usaram IA — como se defendem?"**
> *"O próprio enunciado da UC permitia e incentivava o uso de IA. Documentámos todos os prompts no relatório, incluindo o que a IA errou e o que corrigimos. A transparência é total — há um anexo completo com o log de prompts."*

**"A fronteira entre o que é vosso e o que é da IA está clara?"**
> *"Sim. Diagramas UML todos feitos pela equipa. Requisitos levantados pela equipa. Decisões arquiteturais tomadas pela equipa. A IA gerou texto de documentação, código estrutural e sugeriu edge cases de teste — tudo documentado e com indicação dos deltas que tivemos de corrigir."*

**"Usaram IA para escrever o relatório?"**
> *"Para secções de contextualização e redação técnica densa, sim — e está documentado com o prompt exato usado. As secções de análise crítica, os deltas, as decisões técnicas e as reflexões finais foram escritas pela equipa."*

---

## 8. CHECKLIST ANTES DA APRESENTAÇÃO

Cada membro da equipa deve conseguir responder sem hesitar:

- [ ] Que modelo de IA usaram para implementação e como acediam a ele?
- [ ] O que é a janela de contexto e como isso afetou a vossa estratégia?
- [ ] Qual a diferença entre sessão de camada, de módulo e de correção?
- [ ] Deem um exemplo concreto de um delta — o que a IA errou e como corrigiram?
- [ ] Deem um exemplo de uma alucinação que causou um bug real?
- [ ] A IA fez os diagramas UML? (Resposta: não)
- [ ] A IA levantou os requisitos? (Resposta: não)
- [ ] Qual foi o contributo humano insubstituível no projeto?
