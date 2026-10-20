-- Promove a administrador um usuário que VOCÊ já criou em
-- Authentication > Users (com senha forte). Este arquivo não cria usuários nem senhas.
--
-- Como usar: SQL Editor do Supabase > cole este conteúdo > troque o e-mail > Run.
insert into public.admins (user_id)
select id from auth.users where email = lower('seu-email@exemplo.com.br')
on conflict (user_id) do nothing;

-- Conferência: deve listar o seu e-mail
select u.email, a.created_at as admin_desde
from public.admins a
join auth.users u on u.id = a.user_id;
