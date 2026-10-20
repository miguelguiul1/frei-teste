-- =====================================================================
-- LGPD: consentimento obrigatório e exclusão de inscrições por admins
-- =====================================================================

alter table public.inscricoes
  add column if not exists consentimento    boolean not null default false,
  add column if not exists consentimento_em timestamptz;

comment on column public.inscricoes.consentimento is 'Aceite do uso dos dados (LGPD), marcado no formulário.';
comment on column public.inscricoes.consentimento_em is 'Momento do aceite, gravado pelo banco.';

-- visitantes podem enviar o aceite; o horário do aceite é sempre definido pelo servidor
grant insert (consentimento) on table public.inscricoes to anon, authenticated;

-- trigger de inserção: mantém a normalização/antispam e registra o horário do aceite
create or replace function public.inscricoes_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email            := lower(trim(new.email));
  new.nome             := trim(new.nome);
  new.created_at       := now();
  new.consentimento_em := case when new.consentimento then now() else null end;

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

-- INSERT: inscrições abertas E consentimento marcado
drop policy if exists "Visitantes podem enviar inscrição" on public.inscricoes;
create policy "Visitantes podem enviar inscrição"
  on public.inscricoes
  for insert
  to anon, authenticated
  with check ((select public.inscricoes_abertas()) and consentimento = true);

-- DELETE: só administradores (pedidos de exclusão pela LGPD)
grant delete on table public.inscricoes to authenticated;

drop policy if exists "Somente administradores apagam inscrições" on public.inscricoes;
create policy "Somente administradores apagam inscrições"
  on public.inscricoes
  for delete
  to authenticated
  using ((select public.is_admin()));

-- Reforço: o Supabase concede privilégios padrão a anon/authenticated em tabelas novas.
-- A tabela admins só é gerenciada pelo SQL Editor (a RLS já bloqueia; isto remove até a permissão).
revoke all on table public.admins from anon, authenticated;
