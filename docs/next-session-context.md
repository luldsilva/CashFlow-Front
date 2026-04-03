# Contexto da Próxima Sessão

## Direção atual do produto

O `CashFlow` não deve mais ser pensado como um CRUD de despesas.

A direção alinhada agora é construir um produto de `planejamento financeiro operacional familiar`, capaz de responder com clareza:

- quanto entrou no mês
- quanto já saiu
- quanto ainda está comprometido
- quanto ainda pode ser gasto sem desorganizar o mês
- quanto pode ser separado para investimento

O problema real a resolver é substituir o controle manual em caderno por uma operação mensal confiável, repetível e visível, sem depender de memória para contas pequenas, recorrências e compromissos futuros.

## Contexto real de uso que está guiando o produto

O cenário de referência atual é o de uma família de 3 pessoas:

- casal
- 1 filho com menos de 1 ano
- renda concentrada em fluxo `PJ`
- renda com alguma variação mensal

Compromissos e características do fluxo:

- aluguel + condomínio no dia `10`
- demais contas entre os dias `15` e `20`
- contas fixas recorrentes
- contas recorrentes variáveis, como imposto `PJ`, energia e gás
- pequenas despesas recorrentes e assinaturas que podem passar despercebidas
- cartão de crédito com impacto no caixa do mês atual e do próximo

O objetivo imediato do produto é responder:

- ainda há dinheiro no mês?
- quanto está realmente livre?

O objetivo seguinte é:

- separar parte do valor livre para investimentos mensais

Expansões futuras:

- Open Finance
- leitura mais ampla da vida financeira
- consolidação automática de dados
- eventual visão de dívidas e passivos

## Prioridade de produto

A prioridade ficou definida nesta ordem:

1. `Controle financeiro familiar`
2. `Controle e planejamento de investimentos`
3. `Integrações externas e inteligência financeira ampliada`

Decisão importante:

- não fazer um MVP pequeno demais
- partir para um MVP mais encorpado, desde que já seja utilizável no próximo ciclo real de contas
- o MVP precisa substituir o caderno com segurança

## Regras de negócio centrais

### 1. Saldo bruto vs saldo livre

A regra mais importante do domínio é separar claramente:

- dinheiro que parece disponível
- dinheiro que já está comprometido

O produto precisa mostrar com clareza a diferença entre:

- `saldo bruto`
- `saldo comprometido`
- `saldo livre`
- `valor possível para investir`

### 2. Planejado, previsto e realizado

O sistema deve distinguir:

- `planejado`
- `previsto`
- `realizado`

Isso vale tanto para:

- entradas
- saídas
- aportes

Toda movimentação precisa ter:

- competência
- contexto temporal
- impacto no mês atual ou futuro

### 3. Recorrência nativa

Recorrência não é detalhe. Precisa ser parte nativa do produto para:

- renda
- contas fixas
- contas recorrentes variáveis
- assinaturas
- pequenos recorrentes
- aportes planejados

Contas como imposto `PJ`, gás e energia não são totalmente fixas, mas também não são totalmente imprevisíveis.

O sistema precisa suportar:

- valor esperado
- ajuste posterior
- histórico por competência

### 4. Cartão de crédito como entidade própria

Cartão de crédito não pode ser tratado como despesa simples.

Precisa refletir:

- compras
- fechamento
- vencimento
- impacto no caixa do mês atual
- impacto no caixa do mês seguinte

## Planejamento por percentuais

O produto deve incorporar planejamento por percentuais como uma camada importante da experiência.

Esse modelo:

- não será regra rígida
- será um guia configurável
- deve apoiar organização financeira e educação financeira aplicada

Exemplo discutido:

- `50%` essenciais/fixos
- `10%` educação
- `20%` investimentos
- `10%` aposentadoria
- `10%` livre

Esses percentuais precisam ser:

- sugeridos no onboarding
- personalizáveis
- acompanhados ao longo do mês

O sistema deve comparar:

- planejado por bucket
- realizado por bucket

## Onboarding e experiência principal

O onboarding passa a ser peça central da experiência.

O usuário não deve cair em tela vazia. O produto precisa começar entendendo:

- composição familiar
- renda média
- variabilidade da renda
- periodicidade principal da renda
- modelo inicial de planejamento
- percentuais desejados
- fontes de renda
- contas fixas e recorrentes
- cartões e vencimentos

Depois disso, o usuário entra em um dashboard principal já configurado para o mês.

## Dashboard principal

O dashboard precisa existir desde cedo e ser operacional, não apenas analítico.

Indicadores mínimos:

- entrou no mês
- saiu no mês
- comprometido até o fim do mês
- livre para gastar
- livre para investir

Blocos importantes ao redor disso:

- próximos vencimentos
- contas atrasadas
- status do cartão
- assinaturas e pequenos recorrentes
- aderência ao modelo percentual
- comparação com mês anterior, quando possível

## Frente de investimentos

Investimentos já fazem parte da visão do produto, mas seguem como segunda prioridade.

Estratégia inicial mais pragmática:

- meta mensal de aporte
- aporte planejado
- aporte realizado
- posição por ativo
- classificação por tipo
- leitura simples de evolução patrimonial

Tipos iniciais de ativo:

- renda fixa
- `FIIs`
- ações
- `ETFs`
- caixa

Direção prática:

- começar com entrada manual
- depois enriquecer com API de mercado

Observação já alinhada:

- a `B3` tem portal de APIs, mas o caminho não parece simples para um MVP de pessoa física
- uma alternativa prática futura para cotações de ativos brasileiros pode ser a `brapi`
- `Open Finance` faz sentido como fase posterior, por exigir mais consentimento, integração institucional e cuidado regulatório

## Roadmap alinhado com o backend

### Fase 1A. Setup financeiro inicial

- composição familiar
- renda
- modelo de planejamento
- buckets percentuais
- categorias principais

### Fase 1B. Motor de compromissos do mês

- obrigações financeiras por competência
- vencimentos
- recorrência
- status previsto, pago e ajustado

### Fase 1C. Resumo financeiro do mês e dashboard operacional

- entrada prevista
- saída paga
- comprometido
- livre para gastar
- livre para investir
- próximos vencimentos
- leitura por bucket

### Fase 1D. Cartão de crédito e fatura do ciclo

- cadastro de cartão
- fechamento
- vencimento
- fatura por competência
- impacto no ciclo

### Fase 1E. Fechamento e revisão mensal

- fechar o mês
- snapshot consolidado
- observações do ciclo
- revisão posterior do mês

### Fase 2A. Plano de investimentos

- meta mensal de aporte
- planejamento de investimento
- aporte planejado
- aporte realizado

### Fase 2B. Ativos e posições

- cadastro de ativos
- tipo de ativo
- posição consolidada por ativo

### Fase 2C. Leitura da carteira

- total investido
- distribuição por tipo
- evolução patrimonial

### Fase 3. Integrações e enriquecimento externo

- Open Finance
- cotações externas
- consolidação automática
- leitura ampliada de situação financeira e passivos

## Implicações para o frontend

O frontend precisa deixar de girar em torno de uma tela principal de despesas.

A próxima evolução de UX deve reorganizar o produto ao redor de:

- onboarding
- dashboard operacional do mês
- entradas de renda
- obrigações recorrentes
- cartão e faturas
- buckets percentuais
- visão de saldo comprometido e saldo livre

Ou seja:

- o centro da experiência não é mais cadastrar despesa isolada
- o centro da experiência é operar e entender o mês financeiro da família

## Base técnica já existente no frontend

O projeto atual continua em:

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `TanStack Query`
- `React Hook Form`
- `Zod`

Também já existem:

- integração com backend
- autenticação
- fluxos básicos de despesas
- upload de anexo
- exportação de relatório
- interface em `pt-BR`
- tema escuro e claro
- reorganização parcial da UI com componentes por pasta

Essa base continua útil, mas precisa ser reinterpretada à luz da nova direção do produto.

## Pendências técnicas já conhecidas no frontend

Continuam pendentes:

1. Corrigir relatórios vazios:
- impedir download vazio de `PDF` e `Excel`
- tratar corretamente cenários de `204 NoContent`

2. Corrigir toast duplicado na criação com anexo:
- manter só o feedback principal da criação da despesa
- preservar toast de anexo apenas quando o anexo acontecer depois, em despesa já existente

## Mobile

A versão mobile continua no radar, mas ficou definido que ela vem `depois da entrega do MVP web`.

Decisão atual:

- não iniciar mobile agora
- primeiro entregar o MVP principal com operação financeira familiar funcionando
- só depois discutir e planejar a versão mobile

Quando esse assunto voltar, a conversa deve considerar:

- `React Native` como direção provável
- suporte a celular e tablet
- reaproveitamento de domínio, API e decisões de produto já consolidadas no web

## Particularidades do roadmap de frontend

O roadmap do frontend deve espelhar o backend na lógica de produto, mas pode carregar fases ou anotações próprias de experiência.

Por enquanto, as particularidades assumidas no front são:

- prioridade em `responsividade web` durante toda a Fase 1
- navegação orientada por dashboard, setup, obrigações, cartões e fechamento
- estados vazios, loading, erro e sucesso como parte do escopo visual
- camada `mobile nativa` tratada como frente posterior ao MVP web

## O que foi feito hoje no frontend

Hoje o frontend foi reposicionado para refletir a Fase 1 já implementada no backend.

Entregas concluídas:

- alinhamento do roadmap do front com o faseamento do backend
- criação do contexto de fases em `docs/phase-delivery-context.md`
- reorganização do app para um shell principal orientado por produto, e não mais por uma única tela de despesas
- criação das rotas e telas principais da Fase 1:
  - dashboard operacional
  - setup financeiro inicial
  - obrigações do mês
  - cartões e faturas
  - fechamento e revisão mensal
- criação do cliente HTTP e dos tipos da Fase 1 para integração com o backend
- ajuste do posicionamento textual das telas de autenticação

Também foram implementados os fluxos de senha:

- `esqueci minha senha` em `/forgot-password`
- `redefinir senha` em `/reset-password?token=...`
- `alterar senha autenticada` em `/app/settings/security`

Validação concluída hoje:

- `npm run build` executado com sucesso após as mudanças

## Pendências imediatas para testar amanhã

Validar manualmente os fluxos recém-implementados:

- solicitar reset em `/forgot-password`
- capturar o token/link gerado pelo backend em ambiente local
- redefinir a senha em `/reset-password?token=...`
- testar troca autenticada de senha em `/app/settings/security`
- confirmar mensagens de erro para:
  - token ausente
  - token inválido ou expirado
  - senha atual inválida
  - confirmação divergente

Também vale confirmar amanhã:

- se os contratos reais das respostas do backend batem com os envelopes assumidos no frontend para listas
- se todos os endpoints da Fase 1 estão respondendo no formato esperado em ambiente local

## Resumo executivo

Em resumo, a posição do produto deixa de ser `controle de gastos` e passa a ser:

`organizar a vida financeira da família, mostrar o que está comprometido, o que está livre e o que pode virar investimento`

## Ponto de partida sugerido para a próxima sessão

1. Testar manualmente os fluxos de senha implementados hoje.
2. Validar integração real da Fase 1 com o backend em ambiente local.
3. Iniciar a `Fase 2` no frontend, começando por `2A. Plano de investimentos`.
4. Manter mobile fora do escopo até o MVP web estar entregue.
