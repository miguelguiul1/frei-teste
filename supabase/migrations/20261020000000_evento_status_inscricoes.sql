-- =====================================================================
-- Status do evento no banco: fecha as inscrições também para quem
-- chamar a API diretamente, sem passar pelo site.
--
-- Para a próxima edição, rode no SQL Editor:
--   update public.evento_config set status = 'aberto', atualizado_em = now() where id = 1;
-- (e troque `statusEvento` para "aberto" em src/config/evento.ts)
-- =====================================================================

create table if not exists public.evento_config (
  id             smallint primary key default 1 check (id = 1), -- tabela de linha única
  status         text not null default 'encerrado' check (status in ('aberto', 'encerrado')),
  atualizado_em  timestamptz not null default now()
);

comment on table public.evento_config is
  'Linha única com o status do evento. "encerrado" bloqueia novas inscrições pela RLS.';

-- a 6ª edição (19/09/2026) já aconteceu: começa encerrado
insert into public.evento_config (id, status) values (1, 'encerrado')
on conflict (id) do update set status = excluded.status, atualizado_em = now();

-- RLS sem policies: ninguém lê ou altera pela API pública; só pelo SQL Editor
alter table public.evento_config enable row level security;
revoke all on table public.evento_config from anon, authenticated;

create or replace function public.inscricoes_abertas()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select c.status = 'aberto' from public.evento_config c where c.id = 1), false);
$$;

revoke all on function public.inscricoes_abertas() from public;
grant execute on function public.inscricoes_abertas() to anon, authenticated;

-- INSERT só é aceito com o evento aberto
drop policy if exists "Visitantes podem enviar inscrição" on public.inscricoes;
create policy "Visitantes podem enviar inscrição"
  on public.inscricoes
  for insert
  to anon, authenticated
  with check ((select public.inscricoes_abertas()));
