-- Apodos únicos (sin distinguir mayúsculas). Ejecutar después de setup.sql.
begin;
create table if not exists public.muestra_apodos (
  clave    text primary key,                 -- apodo en minúsculas
  apodo    text not null,
  jugador  text not null check (length(jugador) between 1 and 64),  -- identificador del celular
  creada   timestamptz not null default now()
);
alter table public.muestra_apodos enable row level security;
revoke all on public.muestra_apodos from public, anon, authenticated;

-- Los apodos que ya tienen partida quedan reservados.
insert into public.muestra_apodos (clave, apodo, jugador)
select lower(apodo), apodo, 'partida-' || id from public.muestra_puntos
on conflict (clave) do nothing;
create unique index if not exists muestra_puntos_apodo_unico on public.muestra_puntos (lower(apodo));

-- Reserva un apodo para un celular. ok = true si quedó (o ya estaba) reservado para ese celular.
create or replace function public.reservar_apodo(p_apodo text, p_jugador text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare a text := left(btrim(regexp_replace(coalesce(p_apodo, ''), '\s+', ' ', 'g')), 24);
        j text;
begin
  if a = '' or p_jugador is null or length(p_jugador) not between 1 and 64 then
    return jsonb_build_object('ok', false, 'motivo', 'invalido');
  end if;
  insert into public.muestra_apodos (clave, apodo, jugador) values (lower(a), a, p_jugador)
  on conflict (clave) do nothing;
  select m.jugador into j from public.muestra_apodos m where m.clave = lower(a);
  return jsonb_build_object('ok', j = p_jugador, 'motivo', case when j = p_jugador then null else 'en_uso' end);
end;
$$;
revoke all on function public.reservar_apodo(text, text) from public;
grant execute on function public.reservar_apodo(text, text) to anon;

-- registrar_puntos: ignora cualquier conflicto (id repetido o apodo repetido).
create or replace function public.registrar_puntos(
  p_id text, p_apodo text, p_aciertos integer, p_pistas integer, p_segundos integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v integer;
begin
  insert into public.muestra_puntos(id, apodo, aciertos, pistas, segundos)
  values (p_id, left(btrim(regexp_replace(p_apodo, '\s+', ' ', 'g')), 24), p_aciertos, p_pistas, p_segundos)
  on conflict do nothing;
  select puntos into v from public.muestra_puntos where id = p_id;
  return jsonb_build_object('ok', true, 'puntos', v);
end;
$$;
commit;
