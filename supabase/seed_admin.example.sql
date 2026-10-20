-- Promove um usuário (já criado em Authentication > Users) a administrador.
-- Rode no SQL Editor do Supabase trocando o e-mail abaixo.
insert into public.admins (user_id)
select id from auth.users where email = 'secretaria@exemplo.com.br'
on conflict (user_id) do nothing;
