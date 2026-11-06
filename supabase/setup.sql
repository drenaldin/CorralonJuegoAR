-- Ranking de la Búsqueda del QR · Muestra Anual 2026 · UTU San Marcos
-- Pegar completo en Supabase → SQL Editor → Run.
begin;
create table if not exists public.muestra_puntos (
  id        text primary key check (length(id) between 1 and 64),
  apodo     text not null check (length(apodo) between 1 and 24),
  aciertos  integer not null check (aciertos between 0 and 15),
  pistas    integer not null default 0 check (pistas between 0 and 45),
  segundos  integer not null check (segundos between 0 and 86400),
  puntos    integer generated always as
              (greatest(0, aciertos * 100 - pistas * 25 + greatest(0, 300 - segundos / 10))) stored,
  creada    timestamptz not null default now()
);
alter table public.muestra_puntos enable row level security;
revoke all on public.muestra_puntos from public, anon, authenticated;

-- Solo permite agregar una partida (el puntaje lo calcula la base). Reintentar no duplica.
create or replace function public.registrar_puntos(
  p_id text, p_apodo text, p_aciertos integer, p_pistas integer, p_segundos integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v integer;
begin
  insert into public.muestra_puntos(id, apodo, aciertos, pistas, segundos)
  values (p_id, left(btrim(regexp_replace(p_apodo, '\s+', ' ', 'g')), 24), p_aciertos, p_pistas, p_segundos)
  on conflict (id) do nothing;
  select puntos into v from public.muestra_puntos where id = p_id;
  return jsonb_build_object('ok', true, 'puntos', v);
end;
$$;

-- Los 20 mejores y el total de partidas.
create or replace function public.ver_ranking()
returns table(apodo text, aciertos integer, pistas integer, segundos integer, puntos integer, total bigint)
language sql stable security definer set search_path = '' as $$
  select m.apodo, m.aciertos, m.pistas, m.segundos, m.puntos, count(*) over () as total
  from public.muestra_puntos m
  order by m.puntos desc, m.segundos, m.creada
  limit 20;
$$;
revoke all on function public.registrar_puntos(text, text, integer, integer, integer) from public;
revoke all on function public.ver_ranking() from public;
grant execute on function public.registrar_puntos(text, text, integer, integer, integer) to anon;
grant execute on function public.ver_ranking() to anon;
commit;
