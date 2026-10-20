# 6ª Feira das Profissões do Frei

Site da **6ª Feira das Profissões do Frei**, do Instituto Social Nossa Senhora de Fátima (Veleiros, São Paulo).

- **Landing page** (`/`): página única com rolagem suave e menu por âncoras.
- **Login administrativo** (`/admin/login`): e-mail e senha pelo Supabase Auth.
- **Painel** (`/admin`): rota protegida com as inscrições recebidas, busca, filtro por curso e exportação em CSV.

Stack: React 18 + TypeScript + Vite, Tailwind CSS 3 (tokens do Figma) + shadcn/ui, react-hook-form + zod, Supabase (banco + auth), deploy na Vercel.

---

## Rodando localmente

```bash
pnpm install
cp .env.example .env   # preencha com os dados do Supabase
pnpm dev               # http://localhost:5173
```

| Comando          | O que faz                               |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | servidor de desenvolvimento             |
| `pnpm build`     | checagem de tipos + build de produção   |
| `pnpm lint`      | ESLint (inclui regras de acessibilidade) |
| `pnpm typecheck` | somente checagem de tipos               |
| `pnpm preview`   | serve o build de produção localmente    |

### Variáveis de ambiente

| Variável                 | Onde encontrar                                                   |
| ------------------------ | ---------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase > Project Settings > API > Project URL                  |
| `VITE_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > chave `anon` / publishable    |
| `VITE_SITE_URL` (opc.)   | domínio público, usado nas tags Open Graph                       |

> **Nunca** use a `service_role` key no front-end. Tudo que começa com `VITE_` vai para o navegador.
> O `.env` está no `.gitignore`.

---

## Data, horário e local do evento

Ficam **somente** em [`src/config/evento.ts`](src/config/evento.ts). Ao mudar a data (`data: '2026-09-19'`) ou o horário (`horaInicio`, `horaFim`), o site inteiro se atualiza: card "Como chegar", footer, mensagem de sucesso e as opções de "Previsão de chegada" do formulário.

Os contatos (Instagram e telefones) ficam em [`src/config/site.ts`](src/config/site.ts).

## Onde editar os conteúdos

| Conteúdo                         | Arquivo                       |
| -------------------------------- | ----------------------------- |
| Depoimentos (carrossel)          | `src/data/depoimentos.ts`     |
| Cursos (carrossel)               | `src/data/cursos.ts`          |
| Programação (linha do tempo)     | `src/data/programacao.ts`     |
| Texto do Instituto / Frei Xavier | `src/data/instituto.ts`       |
| "Por que participar"             | `src/data/motivos.ts`         |
| "O que você ganha"               | `src/data/beneficios.ts`      |
| Galeria "Nossa última Feira"     | `src/data/galeria.ts`         |
| Parceiros (`destaque: true` aparece na versão resumida) | `src/data/parceiros.ts` |
| Opções dos selects do formulário | `src/data/inscricao.ts`       |

---

## Supabase

### 1. Aplicar a migration

O SQL está em [`supabase/migrations/20260901000000_create_inscricoes.sql`](supabase/migrations/20260901000000_create_inscricoes.sql). Escolha **uma** das opções:

**Opção A: pelo painel (mais simples)**

1. Abra o projeto em <https://supabase.com/dashboard> e vá em **SQL Editor > New query**.
2. Cole o conteúdo do arquivo de migration e clique em **Run**.

**Opção B: pela Supabase CLI**

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

A migration pode ser executada mais de uma vez sem causar erro. Ela cria:

- **`inscricoes`**: `id`, `created_at`, `nome`, `telefone` (só dígitos), `email`, `escolaridade`, `ex_aluno` (bool), `curso_interesse`, `como_soube`, `previsao_chegada`, com validações (`check`).
- **RLS ativada**:
  - visitantes (`anon`) podem apenas fazer **INSERT**, e só nas colunas do formulário;
  - **SELECT** só para usuários **autenticados que sejam administradores**;
  - não existe UPDATE/DELETE pela API.
- **`admins`** e a função `is_admin()`: a lista de quem pode ler as inscrições.
- **Antispam no servidor**: um trigger que normaliza o e-mail e recusa mais de 3 inscrições com o mesmo e-mail a cada 10 minutos.

> **Por que existe a tabela `admins`?** Liberar o SELECT para *qualquer* usuário autenticado é arriscado: com a anon key pública, qualquer pessoa poderia criar uma conta pela API (se o cadastro estiver aberto) e ler os dados pessoais dos inscritos. Com `admins`, só as contas que você promover têm acesso.

### 2. Criar o usuário administrador

1. **Authentication > Users > Add user > Create new user**: informe o e-mail e a senha e marque *Auto Confirm User*.
2. No **SQL Editor**, rode o conteúdo de [`supabase/seed_admin.example.sql`](supabase/seed_admin.example.sql), trocando o e-mail.

### 3. Recomendado: bloquear novos cadastros

Em **Authentication > Sign In / Providers > Email**, desative **Allow new users to sign up**. Os administradores são criados manualmente (passo 2).

### Proteção contra spam no formulário

- Campo **honeypot** invisível (`website`): se for preenchido, o envio é descartado em silêncio.
- **Tempo mínimo** de 3 segundos entre abrir a página e enviar.
- **Limite no navegador**: no máximo 3 envios a cada 10 minutos (`src/lib/rateLimit.ts`).
- **Limite no banco**: o trigger da migration, descrito acima.

---

## Deploy na Vercel

O projeto já tem um [`vercel.json`](vercel.json) com o build (`pnpm build` → `dist`), o fallback de SPA (para `/admin` e `/admin/login` funcionarem ao recarregar a página), o cache dos assets e os headers de segurança.

1. Em <https://vercel.com/new>, importe o repositório `miguelguiul1/frei-teste`. O framework **Vite** é detectado sozinho.
2. Em **Settings > Environment Variables**, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Production e Preview). `VITE_SITE_URL` é opcional: sem ela, o site usa o domínio de produção da Vercel nas tags Open Graph.
3. Clique em **Deploy**. Cada push na branch principal publica em produção, e as outras branches ganham URLs de preview.
4. No Supabase, em **Authentication > URL Configuration**, coloque o domínio da Vercel em *Site URL*.

---

## Imagens e logos: o que falta enviar

Todas as imagens atuais foram **extraídas do PDF do Figma** e convertidas para WebP. Funcionam, mas várias estão em baixa resolução. Substitua os arquivos **mantendo o mesmo nome e a mesma pasta** (`public/images/...`); se mudar o nome, ajuste o arquivo de dados correspondente. Enquanto uma foto de conteúdo (hero, cursos, depoimentos, galeria) não existir, o site mostra um placeholder neutro no lugar.

| Arquivo (`public/images/`)                  | Situação atual            | O que enviar                                         |
| ------------------------------------------- | ------------------------- | ---------------------------------------------------- |
| `hero/alunos-robotica.webp`                 | 740×500, baixa resolução  | foto original dos alunos com robôs (≥ 1600 px de largura) |
| `instituto/fachada.webp`                    | 1072×603                  | foto da fachada em alta (≥ 1920 px)                  |
| `instituto/alunos-escadaria.webp`           | 1280×720                  | foto dos alunos na escadaria em alta (≥ 1920 px)     |
| `instituto/frei-xavier.webp`                | 545×600, recorte          | retrato do Frei Xavier (quadrado, ≥ 600 px)          |
| `depoimentos/ricardo-hessel.webp`           | 332×488, recortado (PNG/WebP com transparência) | versão maior com fundo transparente     |
| `depoimentos/*.webp`                        | só existe um depoimento   | fotos e textos de outros ex-alunos (cadastre em `src/data/depoimentos.ts`) |
| `cursos/informatica.webp`, `ingles.webp`, `eletromecanica.webp`, `administracao.webp` | ~800 px; algumas parecem fotos de banco de imagens | fotos próprias dos cursos, ou confirmar a licença das atuais |
| `galeria/feira-01.webp` … `feira-05.webp`   | 740×500, baixa resolução  | fotos originais da 5ª Feira (≥ 1400 px)              |
| `galeria/tradicao-equipe.webp`              | 1017×763                  | foto da equipe em alta                               |
| `parceiros/*.webp` (6 logos)                | 164×164, baixa resolução  | logos em **SVG** ou PNG ≥ 400 px com fundo transparente |
| `marca/instituto-logo.webp`                 | 145×169                   | logo do Instituto em SVG ou PNG em alta              |
| `marca/logo-feira.webp`                     | 256 px (ok)               | se possível, a versão SVG                            |
| `/og-image.jpg`, `/favicon.png`, `/apple-touch-icon.png` | gerados a partir do logo | opcional: arte oficial para redes sociais (1200×630) |

Para converter as fotos para WebP, use <https://squoosh.app> (qualidade ~80) ou outro conversor.

Também falta confirmar:

- os links dos parceiros (campo `site` em `src/data/parceiros.ts`), que são opcionais;
- o destino do botão **"Mais Depoimentos"**, que hoje abre o Instagram do Instituto (`maisDepoimentosUrl` em `src/data/depoimentos.ts`);
- as opções de **Escolaridade** e **Como ficou sabendo**, que não estão no Figma (foram propostas e ficam em `src/data/inscricao.ts`).

---

## Estrutura de pastas

```
src/
  config/      evento.ts (data/horário/local) e site.ts (contatos)
  data/        conteúdos da landing (depoimentos, cursos, programação…)
  lib/         supabase, validação (zod), máscara de telefone, CSV, utilitários
  hooks/       useAuth, useActiveSection (scrollspy), usePageTitle
  components/  Navbar, Footer, Img (lazy + placeholder), Lightbox, formulário…
  components/ui/  componentes shadcn/ui (button, input, select, dialog, carousel…)
  sections/    uma seção da landing por arquivo
  pages/       HomePage, AdminLoginPage, AdminDashboardPage, NotFoundPage
supabase/
  migrations/  SQL da tabela, RLS e trigger antispam
public/images/ fotos e logos (WebP)
```

## Design

- **Cores** (tokens `brand.*` no `tailwind.config.ts`): navy `#042A7E`, azul `#2C5EC9`, azul-claro `#D8EFFF`, cinza do hero `#F6F6F6`, além dos degradês amostrados do Figma.
- **Fontes**: Work Sans no site todo e Montserrat no rodapé, via `@fontsource` com `font-display: swap`.
- **Correções em relação ao Figma**: "Estrutura", "Fazer Login", "robótica", "Estrutura de automóveis", o ano 2026 na descrição do rodapé e "Carga horária" padronizado em todos os cursos.

## Acessibilidade

- Link "Pular para o conteúdo", foco sempre visível e menu mobile com `aria-expanded`, que fecha com `Esc` e devolve o foco ao botão.
- Carrosséis seguem o padrão WAI-ARIA: navegação pelas setas do teclado, slides ocultos ficam inertes e uma região `aria-live` anuncia o slide atual.
- No formulário, cada campo tem `label`, `aria-invalid` e `aria-describedby` apontando para a mensagem de erro, e o foco vai para o primeiro campo inválido.
- O lightbox navega com as setas, fecha com `Esc` e devolve o foco à miniatura.
- Animações respeitam `prefers-reduced-motion`.
- Auditoria com axe-core (WCAG 2.1 AA): nenhuma violação na landing (desktop e mobile) nem no login.
