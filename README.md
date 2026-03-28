# CashFlow Front

Frontend MVP do CashFlow em React + TypeScript + Vite.

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
- listagem de despesas
- criação de despesa
- edição de despesa
- exclusão de despesa
- visualização de detalhes
- upload de anexo por despesa

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
