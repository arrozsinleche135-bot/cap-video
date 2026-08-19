begin;

-- get_my_access_context() perdio el campo contentRevision cuando se
-- reescribio para usar sesiones de contraseña (20260806000000). Sin ese
-- campo, el cliente siempre calculaba expectedRevision = 0, muy por debajo
-- de la revision real (que ya iba en 25+), asi que CADA guardado desde la
-- app real terminaba en STALE_SNAPSHOT. Esto viene de antes de hoy, no es
-- algo nuevo.
create or replace function public.get_my_access_context()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'userId', p.user_id,
    'organizationId', p.organization_id,
    'organization', o.name,
    'role', p.role,
    'displayName', p.display_name,
    'active', p.active,
    'contentRevision', o.content_revision
  )
  from public.profiles p
  join public.organizations o on o.id = p.organization_id
  where private.is_password_session()
    and p.user_id = (select auth.uid())
    and p.active
    and o.active
  limit 1
$$;

commit;
