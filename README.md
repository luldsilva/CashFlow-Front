# CashFlow Front

Frontend do CashFlow em React + TypeScript + Vite, agora reposicionado para a Fase 1 de planejamento financeiro operacional familiar.

## Stack

- React 19
- Vite 8
- React Router 7
- TanStack Query 5
- Tailwind CSS 4
- React Hook Form + Zod
- Axios

## Integração com backend

Durante o desenvolvimento, o Vite faz proxy de `/api` para `http://localhost:8080`.

Isso permite rodar o frontend separado sem mexer em CORS no backend agora.

## Fluxo suportado

- cadastro
- login
- dashboard mensal
- setup financeiro inicial
- obrigações financeiras por competência
- cartões e faturas
- fechamento e revisão mensal

## Roadmap refletido no front

O frontend agora acompanha o faseamento principal do backend:

- `1A` setup financeiro inicial
- `1B` motor de compromissos do mês
- `1C` dashboard operacional do mês
- `1D` cartões e faturas
- `1E` fechamento e revisão mensal

Particularidade atual do front:

- a fase mobile continua registrada como frente posterior ao MVP web

## Como rodar

1. Suba o backend:

```bash
cd /home/lucaslisilva/projetos/CashFlow
docker compose up -d --build api
```

2. Rode o frontend:

```bash
cd /home/lucaslisilva/projetos/CashFlow-Front
npm install
npm run dev
```

3. Abra:

```text
http://localhost:5173
```
