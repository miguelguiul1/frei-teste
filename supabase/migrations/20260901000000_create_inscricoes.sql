-- =====================================================================
-- 6ª Feira das Profissões do Frei — inscrições
-- Tabela de inscrições + administradores + RLS
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela de inscrições
-- ---------------------------------------------------------------------
create table if not exists public.inscricoes (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  nome              text not null check (char_length(nome) between 5 and 120),
  telefone          text not null check (telefone ~ '^[0-9]{10,11}$'),
  email             text not null check (
                      char_length(email) <= 160
                      and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
                    ),
  escolaridade      text not null check (char_length(escolaridade) between 1 and 80),
  ex_aluno          boolean not null,
  curso_interesse   text not null check (char_length(curso_interesse) between 1 and 120),
  como_soube        text check (char_length(como_soube) <= 80),
  previsao_chegada  text check (char_length(previsao_chegada) <= 40)
);

comment on table public.inscricoes is 'Inscrições recebidas pelo formulário da Feira das Profissões.';
comment on column public.inscricoes.telefone is 'Somente dígitos, com DDD (10 ou 11 dígitos).';

create index if not exists inscricoes_created_at_idx on public.inscricoes (created_at desc);
create index if not exists inscricoes_curso_interesse_idx on public.inscricoes (curso_interesse);
create index if not exists inscricoes_email_created_at_idx on public.inscricoes (email, created_at desc);

-- ---------------------------------------------------------------------
-- Administradores
-- Só quem estiver nesta tabela pode ler as inscrições. Isso impede que
-- alguém que crie uma conta pela API pública (signup) veja os dados.
-- Não há policies: a tabela só é gerenciável pelo SQL Editor / service role.
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------
-- Antispam no servidor: normaliza o e-mail e limita a 3 inscrições
-- com o mesmo e-mail a cada 10 minutos.
-- ---------------------------------------------------------------------
create or replace function public.inscricoes_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email      := lower(trim(new.email));
  new.nome       := trim(new.nome);
  new.created_at := now();

  if (
    select count(*) from public.inscricoes i
    where i.email = new.email
      and i.created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'Muitas inscrições com este e-mail. Tente novamente em alguns minutos.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.inscricoes_before_insert() from public, anon, authenticated;

drop trigger if exists inscricoes_before_insert on public.inscricoes;
create trigger inscricoes_before_insert
  before insert on public.inscricoes
  for each row execute function public.inscricoes_before_insert();

-- ---------------------------------------------------------------------
-- Permissões + Row Level Security
-- ---------------------------------------------------------------------
alter table public.inscricoes enable row level security;

-- privilégios mínimos: visitantes só inserem as colunas do formulário
revoke all on table public.inscricoes from anon, authenticated;
grant insert (nome, telefone, email, escolaridade, ex_aluno, curso_interesse, como_soube, previsao_chegada)
  on table public.inscricoes to anon, authenticated;
grant select on table public.inscricoes to authenticated;

drop policy if exists "Visitantes podem enviar inscrição" on public.inscricoes;
create policy "Visitantes podem enviar inscrição"
  on public.inscricoes
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Somente administradores autenticados leem inscrições" on public.inscricoes;
create policy "Somente administradores autenticados leem inscrições"
  on public.inscricoes
  for select
  to authenticated
  using ((select public.is_admin()));

-- Sem policies de UPDATE/DELETE: ninguém altera ou apaga pela API pública.
