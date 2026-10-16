-- Códigos de acceso (uno por compra) y testimonios.
-- Las tablas no se leen desde la app: la app solo llama a las dos funciones de abajo.

create table public.access_codes (
  code          text primary key,
  transaction   text unique not null,
  buyer_email   text not null,
  buyer_name    text,
  offer_code    text,
  created_at    timestamptz not null default now(),
  redeemed_at   timestamptz,
  revoked_at    timestamptz
);

create table public.testimonials (
  id            bigint generated always as identity primary key,
  code          text not null references public.access_codes(code),
  week          smallint not null check (week in (4, 8)),
  rating        smallint not null check (rating between 1 and 5),
  comment       text check (char_length(comment) <= 600),
  display_name  text check (char_length(display_name) <= 80),
  can_publish   boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (code, week)
);

alter table public.access_codes enable row level security;
alter table public.testimonials enable row level security;
-- Sin políticas: anon no puede leer ni escribir las tablas directamente.

create function public.redeem_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare ok boolean;
begin
  update access_codes
     set redeemed_at = coalesce(redeemed_at, now())
   where code = upper(trim(p_code)) and revoked_at is null
  returning true into ok;
  return coalesce(ok, false);
end;
$$;

create function public.submit_testimonial(
  p_code text, p_week int, p_rating int, p_comment text, p_display_name text, p_can_publish boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from access_codes where code = upper(trim(p_code)) and revoked_at is null) then
    raise exception 'invalid code';
  end if;
  insert into testimonials (code, week, rating, comment, display_name, can_publish)
  values (upper(trim(p_code)), p_week, p_rating, nullif(trim(p_comment), ''), nullif(trim(p_display_name), ''), p_can_publish)
  on conflict (code, week) do update
    set rating = excluded.rating, comment = excluded.comment,
        display_name = excluded.display_name, can_publish = excluded.can_publish, created_at = now();
end;
$$;

revoke all on function public.redeem_code(text) from public;
revoke all on function public.submit_testimonial(text, int, int, text, text, boolean) from public;
grant execute on function public.redeem_code(text) to anon;
grant execute on function public.submit_testimonial(text, int, int, text, text, boolean) to anon;
