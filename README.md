# Finanças — Controle Financeiro Pessoal

App web para controle de finanças pessoais: registre receitas e despesas,
acompanhe um dashboard com resumo mensal e gráfico por categoria, filtre e
exporte suas transações em CSV.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **shadcn/ui** (Base UI) para componentes de interface
- **Supabase** (PostgreSQL + Auth + Row Level Security) como backend
- **Recharts** para o gráfico de despesas por categoria
- Deploy pensado para **Vercel**

## Configurando o Supabase

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com).
2. No painel do projeto, vá em **SQL Editor**, cole o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e execute. Isso cria:
   - a tabela `transactions` com as categorias e tipos (receita/despesa);
   - índices de consulta;
   - as políticas de **Row Level Security** que garantem que cada usuário só
     veja e edite as próprias transações.
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
4. Copie `.env.local.example` para `.env.local` e preencha:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```

5. (Opcional) Em **Authentication → Providers → Email**, desative a
   confirmação por e-mail se quiser testar login/cadastro sem precisar
   confirmar o e-mail durante o desenvolvimento.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Crie uma conta em
`/cadastro`, faça login em `/login` e você será redirecionado para `/dashboard`.

## Estrutura principal

```
proxy.ts                        # renova sessão e protege rotas /dashboard/*
supabase/schema.sql              # schema do banco + RLS
src/lib/supabase/                # clients Supabase (browser/server) + tipos
src/lib/data/transactions.ts     # consultas de transações e resumo mensal
src/lib/actions/                 # Server Actions (auth, CRUD de transações)
src/app/(landing) page.tsx       # landing page pública
src/app/login, /cadastro         # autenticação
src/app/dashboard                # área autenticada (visão geral + transações)
src/components/dashboard         # cards, gráfico de pizza, seletor de período
src/components/transactions      # formulário, tabela, filtros, exportar CSV
```

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas configurações do projeto na Vercel.
4. Deploy.
