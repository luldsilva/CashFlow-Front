# Contexto da Próxima Sessão

## O que foi feito hoje

- Base do frontend criada em `React + Vite + Tailwind + TanStack Query + React Hook Form + Zod`.
- Integração com o backend do `CashFlow` configurada.
- Fluxos principais já cobertos:
  - login
  - cadastro
  - listagem de despesas
  - criação de despesa
  - edição de despesa
  - exclusão de despesa
  - upload de anexo
  - exportação de relatório em PDF e Excel
- Interface traduzida para `pt-BR`.
- Toasts/popup de feedback adicionados para ações principais.
- Tema escuro implementado e ajustado.
- Tema claro refinado para reduzir excesso de branco.
- Criação de despesa com anexo no mesmo fluxo já implementada.
- Arquitetura de UI reorganizada para um padrão mais escalável com:
  - `Tailwind` mantido
  - componentes em pastas próprias
  - extração de blocos visuais maiores da tela de despesas
  - extração de variantes/classes compartilhadas
- A tela principal de despesas deixou de concentrar quase toda a marcação visual:
  - `ExpensesSidebar`
  - `ExpenseFormCard`
  - `ExpenseDetailsCard`
- Componentes base também foram reorganizados em pastas próprias, seguindo uma estrutura mais previsível:
  - `layout/AuthShell`
  - `ui/PrimaryButton`
  - `ui/FieldInput`
  - `ui/FieldSelect`
  - `ui/FieldTextarea`
  - `ui/FormField`
  - `ui/IconButton`
  - `ui/PanelCard`
- A decisão tomada foi seguir com a linha:
  - `Tailwind + componentes por pasta + extração de blocos e variantes`

## Correções pendentes

### 1. Relatórios vazios

Problema:
- Quando não há dados no período selecionado, os PDFs estão sendo criados vazios.

Comportamento desejado:
- Se não houver dados para o período informado, não queremos baixar arquivo vazio.
- Queremos exibir a mensagem padrão do sistema informando que não há dados para o período.

Observação:
- Revisar tanto `PDF` quanto `Excel`.
- Confirmar se a API está retornando `204 NoContent` corretamente em todos os cenários.
- Garantir que o frontend trate isso sem iniciar download vazio.

### 2. Toast duplicado na criação com anexo

Problema:
- Ao criar uma despesa com anexo, hoje aparecem dois feedbacks:
  - despesa criada com sucesso
  - arquivo anexado com sucesso

Comportamento desejado:
- Manter só o feedback principal da criação da despesa.
- Não mostrar o toast separado de anexo quando ele fizer parte do fluxo de criação.

Observação:
- O toast de anexo continua fazendo sentido quando o usuário anexa arquivo depois, na despesa já existente.

## Próximas frentes de produto e UX

### 1. Melhorar design e identidade visual

Queremos revisar:
- direção visual mais consistente
- cores
- hierarquia visual
- sensação menos genérica de dashboard
- possível definição futura de nome/logo/branding

Objetivo:
- deixar a interface com mais cara de produto real e menos cara de base técnica inicial

### 2. Reavaliar telas e fluxos

Queremos rever:
- o desenho das telas atuais
- a organização das informações
- a clareza dos fluxos principais
- o que deve virar dashboard
- o que deve virar cadastro/configuração

### 3. Evoluir o produto para renda vs gastos

Dor real a ser resolvida:
- controlar renda da família versus o que está sendo gasto

Queremos pensar em suporte para:
- registro de renda
- comparação entre renda e despesas
- visão consolidada por período
- dashboards financeiros
- talvez gamificação de alguns fluxos

### 4. Novos dados que o sistema deve suportar

Precisamos considerar modelagem para:
- valor da renda
- periodicidade da renda:
  - diário
  - semanal
  - quinzenal
  - mensal
  - talvez outros períodos
- gastos fixos
- gastos variáveis
- possibilidade de prever despesas recorrentes e comportamento futuro

## Análise de estilização atual

### Situação atual

Hoje o frontend está com muita estilização aplicada diretamente nas `className` dos componentes `tsx`, em vez de separar em arquivos próprios por componente como:

- `Component.tsx`
- `Component.css`
- marcação/estrutura separada por bloco mais isolado

### Por que isso aconteceu

Isso aconteceu principalmente por causa da stack escolhida:

- `React`
- `Tailwind CSS`

Com `Tailwind`, o padrão mais comum de mercado é justamente compor estilo direto no `tsx` com classes utilitárias. A ideia é:

- manter estrutura e estilo próximos
- evitar alternância constante entre `tsx` e `css`
- reduzir naming manual de classes
- acelerar prototipação e ajustes de interface
- facilitar composição visual rápida por estado, variante e responsividade

### Vantagens dessa abordagem

- rapidez para construir telas
- menor custo inicial de organização visual
- responsividade e estados (`hover`, `dark`, `focus`) ficam visíveis no mesmo lugar
- menos risco de conflito de CSS global
- boa aderência ao ecossistema moderno com `Tailwind`

### Desvantagens percebidas

Essa abordagem também tem custos reais, especialmente no seu caso:

- arquivos `tsx` ficam longos e visualmente pesados
- leitura da estrutura da tela fica pior
- manutenção de design mais refinado fica cansativa
- repetição de blocos de classes começa a crescer
- sensação de “estilo inline” incomoda quem prefere separação por responsabilidade visual

### Minha opinião técnica

O problema aqui não é exatamente usar `Tailwind`. O problema é usar `Tailwind` sem uma camada de composição suficiente.

Hoje o frontend está em um ponto intermediário:

- bom para prototipar
- ruim para evoluir design com mais sofisticação

Se o projeto continuar crescendo, eu não recomendaria migrar para um modelo de `html/css` totalmente separado como se fosse um frontend tradicional antigo. Isso costuma perder parte da produtividade que o `React + Tailwind` dá.

Eu recomendaria um meio-termo mais maduro:

1. manter `Tailwind`
2. reduzir classes repetidas criando componentes visuais menores
3. extrair blocos reutilizáveis
4. centralizar tokens visuais
5. usar CSS separado só quando realmente fizer sentido

### Direção sugerida

Em vez de mudar tudo para `tsx + css` por componente agora, a direção mais saudável seria:

- criar componentes como:
  - `panel-card`
  - `section-header`
  - `expense-list-item`
  - `stat-card`
  - `surface`
  - `icon-button`
- mover combinações longas de classe para helpers/componentes
- definir tokens visuais para:
  - cores
  - fundos
  - bordas
  - sombras
  - estados
- deixar CSS separado para:
  - animações
  - padrões visuais mais complexos
  - temas
  - casos onde a utilidade inline piora a leitura

### Decisão sugerida para a próxima sessão

Revisar se queremos evoluir o frontend para um padrão mais organizado de UI, mantendo `Tailwind`, mas com:

- menos classes longas dentro das páginas
- mais componentes visuais reutilizáveis
- melhor separação entre layout, comportamento e aparência

### Decisão efetivamente tomada hoje

Essa direção foi confirmada e já começou a ser aplicada.

Seguiremos com:

- `Tailwind`
- componentes por pasta
- extração de blocos maiores de interface
- extração de variantes visuais e classes compartilhadas

Não vamos migrar agora para uma separação tradicional no estilo `tsx + css` para tudo.
Se houver CSS separado no futuro, será apenas onde fizer sentido real:

- animações
- temas
- padrões visuais mais complexos
- casos em que o JSX ficar menos legível com utilitárias

## Mobile

### Contexto discutido hoje

O mobile não será iniciado agora, mas ficou definido como tema da próxima conversa.

Pontos alinhados:

- existe interesse real em uma versão mobile por utilidade no dia a dia
- o objetivo não é só custo, mas também estudo e aprendizado
- o uso em celular e tablet faz sentido para o produto
- a possibilidade de `iOS` continua em aberto, mesmo sem `Mac`, com limitações práticas no ciclo local

### Direção inicial para a próxima sessão

Conversar sobre o MVP mobile antes de executar.

Assuntos a discutir:

- `React Native` como direção principal
- suporte a tablet
- limitações reais para `iOS` sem `Mac`
- como dividir responsabilidades entre web e mobile
- o que faz sentido reaproveitar do domínio, da API e da estrutura atual

## Perguntas para orientar a próxima sessão

- Como deve ser o modelo de `renda` no domínio?
- Renda será individual, familiar, ou ambos?
- Gastos fixos e variáveis devem ser categorias ou tipos próprios?
- O dashboard inicial deve focar em:
  - saldo do mês
  - comprometimento da renda
  - previsão até o fim do mês
  - evolução histórica
- Existe espaço para gamificação sem atrapalhar a seriedade do produto?

## Prioridade sugerida para a próxima sessão

1. Conversar sobre a frente mobile e delimitar a estratégia inicial do MVP mobile.
2. Corrigir download de relatório vazio.
3. Corrigir toast duplicado na criação com anexo.
4. Revisar ajustes de frontend e UX que ainda ficaram pendentes.
5. Definir como modelar `renda`, recorrência e visão familiar.
6. Só depois evoluir design/dashboard com base nessas decisões.
