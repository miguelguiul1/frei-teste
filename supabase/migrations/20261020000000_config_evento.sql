-- =====================================================================
-- config_evento: interruptor das inscrições no banco.
-- Fecha as inscrições também para quem chamar a API diretamente,
-- sem passar pelo site.
--
-- Para reabrir na próxima edição (SQL Editor do Supabase):
--   update public.config_evento set inscricoes_abertas = true where id = 1;
-- e troque `statusEvento` para "aberto" em src/config/evento.ts.
-- =====================================================================

create table if not exists public.config_evento (
  id                  smallint primary key default 1 check (id = 1), -- tabela de uma linha só
  inscricoes_abertas  boolean not null default false,
  atualizado_em       timestamptz not null default now()
);

comment on table public.config_evento is
  'Linha única. inscricoes_abertas = false bloqueia novas inscrições pela RLS.';

-- a 6ª edição (19/09/2026) já aconteceu: inscrições fechadas
insert into public.config_evento (id, inscricoes_abertas) values (1, false)
on conflict (id) do nothing;

-- mantém atualizado_em em dia a cada alteração
create or replace function public.config_evento_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

drop trigger if exists config_evento_touch on public.config_evento;
create trigger config_evento_touch
  before update on public.config_evento
  for each row execute function public.config_evento_touch();

-- RLS sem policies: ninguém lê nem altera pela API pública; só pelo SQL Editor
alter table public.config_evento enable row level security;
revoke all on table public.config_evento from anon, authenticated;

-- usada pela policy de INSERT (security definer: lê a tabela sem expô-la)
create or replace function public.inscricoes_abertas()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select c.inscricoes_abertas from public.config_evento c where c.id = 1), false);
$$;

revoke all on function public.inscricoes_abertas() from public;
grant execute on function public.inscricoes_abertas() to anon, authenticated;

-- INSERT só é aceito com as inscrições abertas
drop policy if exists "Visitantes podem enviar inscrição" on public.inscricoes;
create policy "Visitantes podem enviar inscrição"
  on public.inscricoes
  for insert
  to anon, authenticated
  with check ((select public.inscricoes_abertas()));
