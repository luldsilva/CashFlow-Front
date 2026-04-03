# Phase Delivery Context

## Objetivo deste documento

Registrar, de forma objetiva, o resumo de negócio de cada fase do produto no frontend.

A ideia deste arquivo é responder rapidamente:

- o que entra em cada fase
- o que isso habilita para o usuário
- o que ainda não entra naquela etapa
- quais particularidades de experiência o frontend precisa considerar

Este documento complementa o roadmap principal e ajuda a manter backend e frontend na mesma leitura de produto, sem confundir fase com lista puramente técnica.

## Fase 1A - Setup financeiro inicial

### Resumo de negócio

Na Fase 1A, o usuário passa a conseguir estruturar a base financeira da família dentro do produto.

Essa fase cobre o começo real do onboarding financeiro:

- composição familiar
- padrão de renda
- frequência principal de entrada
- escolha de um modelo inicial de planejamento
- configuração de buckets percentuais
- definição das categorias principais
- cadastro das fontes de renda iniciais

Na prática, essa fase faz o produto sair de um estado genérico e começar a entender como aquela família organiza o dinheiro.

### O que essa fase habilita

- iniciar o onboarding financeiro com dados reais
- registrar a estrutura base da família
- configurar o modelo inicial de planejamento
- criar buckets e categorias para classificar a operação futura
- preparar a base do dashboard, das obrigações e da leitura por bucket

### O que ainda não entra nesta fase

- cálculo operacional consolidado do mês
- leitura de saldo comprometido
- leitura de saldo livre para gastar
- gestão das obrigações mensais
- cartão de crédito e faturas
- fechamento e revisão mensal

### Particularidade de frontend

No frontend, essa fase precisa funcionar tanto como criação inicial quanto como edição posterior da estrutura financeira.

## Fase 1B - Motor de compromissos do mês

### Resumo de negócio

Na Fase 1B, o produto passa a permitir montar e acompanhar os compromissos financeiros do ciclo mensal.

Essa é a fase em que o sistema começa a apoiar a operação real do mês:

- obrigações financeiras por competência
- vencimentos
- classificação por categoria e bucket
- recorrência
- status previsto, pago e ajustado
- registro de valor pago e data de pagamento

Isso aproxima o produto da rotina real de quem hoje depende de caderno ou memória para não perder contas e pequenos recorrentes.

### O que essa fase habilita

- cadastrar as contas e compromissos do mês
- registrar obrigações antes do pagamento acontecer
- acompanhar o que está previsto, pago ou ajustado
- filtrar a operação por competência mensal
- criar a base para leitura de vencimentos e comprometimento

### O que ainda não entra nesta fase

- leitura consolidada do resumo do mês
- saldo livre para gastar
- saldo livre para investir
- dashboard executivo do mês
- fechamento mensal
- ciclo de cartão de crédito

### Particularidade de frontend

No frontend, essa fase precisa priorizar leitura rápida de vencimentos, status e ações operacionais simples de edição.

## Fase 1C - Resumo financeiro do mês e dashboard operacional

### Resumo de negócio

Na Fase 1C, o produto passa a responder as perguntas centrais do negócio sobre o mês atual.

Essa fase consolida setup e obrigações em uma leitura executiva:

- quanto está previsto de entrada
- quanto já saiu
- quanto ainda está comprometido
- quanto está livre para gastar
- quanto está livre para investir
- quais são os próximos vencimentos
- como os buckets estão performando no mês

É aqui que o produto deixa claramente de ser um cadastro de lançamentos e passa a orientar decisão financeira.

### O que essa fase habilita

- visualizar o resumo financeiro do mês
- acompanhar saldo comprometido e saldo livre
- enxergar próximos vencimentos de forma objetiva
- comparar buckets planejados com valores pagos e comprometidos
- usar um dashboard mensal como home principal do produto

### O que ainda não entra nesta fase

- comparação automática com mês anterior
- fechamento mensal persistido
- cartão de crédito dentro da leitura consolidada do mês
- carteira de investimentos
- integrações externas

### Particularidade de frontend

No frontend, essa fase precisa ser a home principal da aplicação e funcionar bem em responsividade, porque concentra a leitura mais importante do produto.

## Fase 1D - Cartão de crédito e fatura do ciclo

### Resumo de negócio

Na Fase 1D, o produto passa a tratar cartão de crédito como domínio próprio.

Essa fase habilita:

- cadastro de cartões
- configuração de fechamento
- configuração de vencimento
- registro de faturas por competência
- leitura do ciclo de cobrança

Isso é importante porque o cartão não deve aparecer apenas como gasto solto; ele precisa refletir impacto no caixa e no ciclo mensal.

### O que essa fase habilita

- cadastrar cartões com regras operacionais reais
- registrar faturas por competência
- consultar faturas por mês
- visualizar status de fatura aberta, fechada ou paga
- preparar a leitura do impacto do cartão no ciclo financeiro

### O que ainda não entra nesta fase

- detalhamento de compras individuais do cartão
- parcelamento
- importação automática de lançamentos da fatura
- integração automática da fatura no resumo consolidado do dashboard

### Particularidade de frontend

No frontend, essa fase precisa aparecer como área própria, sem misturar mentalmente cartão com obrigação comum.

## Fase 1E - Fechamento e revisão mensal

### Resumo de negócio

Na Fase 1E, o produto passa a permitir fechar formalmente um mês e registrar uma revisão consolidada do ciclo.

Essa fase transforma o resumo mensal em histórico de aprendizado operacional:

- o usuário pode fechar um mês
- registrar observações
- consultar depois o retrato consolidado daquele ciclo

Isso cria disciplina mensal e prepara a evolução futura do modelo financeiro da família.

### O que essa fase habilita

- fechar o mês explicitamente
- salvar um snapshot consolidado do resumo mensal
- consultar revisão mensal com dados e observações
- criar base para comparativos e reaproveitamento futuro

### O que ainda não entra nesta fase

- comparativo automático com meses anteriores
- rollover automático para o próximo mês
- sugestão automática de ajuste de buckets
- fechamento assistido com alertas inteligentes

### Particularidade de frontend

No frontend, essa fase precisa deixar claro quando o mês ainda está aberto e quando já virou modo de revisão.

## Fase 2A - Plano de investimentos

### Resumo de negócio

Na Fase 2A, o produto passa a transformar a sobra livre em uma decisão explícita de investimento.

Entram nessa fase:

- meta mensal de aporte
- planejamento de investimento
- aporte planejado
- aporte realizado

Essa fase inicia a segunda camada do produto: sair do controle do mês e começar a construir patrimônio.

### O que essa fase habilita

- definir meta de aporte mensal
- registrar intenção de investir no mês
- comparar aporte planejado com aporte realizado
- aproximar a leitura de saldo livre da decisão de investir

### O que ainda não entra nesta fase

- posição consolidada por ativo
- distribuição por tipo de ativo
- evolução patrimonial
- cotação externa

## Fase 2B - Ativos e posições

### Resumo de negócio

Na Fase 2B, o produto passa a permitir registrar os ativos e consolidar posição por item investido.

Essa fase adiciona profundidade patrimonial ao módulo de investimentos:

- cadastro de ativos
- classificação por tipo
- posição por ativo

### O que essa fase habilita

- montar a carteira básica do usuário
- separar investimentos por tipo
- acompanhar posição individual por ativo
- preparar a base para leitura patrimonial

### O que ainda não entra nesta fase

- leitura consolidada avançada da carteira
- evolução patrimonial mais rica
- enriquecimento automático por API de mercado

## Fase 2C - Leitura da carteira

### Resumo de negócio

Na Fase 2C, o produto passa a entregar uma leitura consolidada da carteira de investimentos.

Entram nessa fase:

- total investido
- distribuição por tipo
- evolução patrimonial

Isso permite que o usuário veja não apenas se conseguiu aportar, mas também como o patrimônio está organizado.

### O que essa fase habilita

- acompanhar a carteira de forma agregada
- enxergar distribuição entre tipos de ativos
- observar evolução patrimonial ao longo do tempo
- conectar planejamento mensal com construção de patrimônio

### O que ainda não entra nesta fase

- cotação automática em tempo real
- integração com Open Finance
- consolidação externa automática de patrimônio

## Fase 3 - Integrações e enriquecimento externo

### Resumo de negócio

Na Fase 3, o produto passa a sair do modelo majoritariamente manual e começa a usar dados externos para enriquecer a leitura financeira.

Entram nessa fase:

- Open Finance
- cotações externas
- consolidação automática
- leitura ampliada de situação financeira e passivos

Essa fase amplia a inteligência do produto, mas não substitui a importância do core financeiro das fases anteriores.

### O que essa fase habilita

- reduzir parte da digitação manual
- enriquecer posição e leitura patrimonial com dados externos
- ampliar a visão sobre contas, passivos e situação financeira
- começar a consolidar diferentes fontes em uma visão mais automática

### O que ainda não entra nesta fase

- essa fase representa a camada mais avançada do roadmap atual

### Particularidade de frontend

No frontend, essa fase vai exigir atenção especial a consentimento, estados de integração, permissões e clareza visual sobre origem dos dados.

## Observação de produto para frontend

Mesmo acompanhando o roadmap do backend, o frontend mantém uma frente própria de experiência:

- responsividade web já na Fase 1
- estados vazios, loading, erro e sucesso como parte do escopo de entrega
- mobile nativo tratado como etapa posterior ao MVP web

Ou seja, o front espelha o negócio principal, mas pode registrar fases complementares de experiência quando isso ajudar a guiar implementação.
