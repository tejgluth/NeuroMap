-- Security hardening for public API access.
-- Keep public read access for published places/reviews, but remove broad default grants,
-- tighten owner-only tables, and prevent client-supplied user_id spoofing.

alter table public.reviews alter column user_id set default auth.uid();
alter table public.favorites alter column user_id set default auth.uid();
alter table public.review_reports alter column user_id set default auth.uid();

drop policy if exists favorites_owner_all on public.favorites;
drop policy if exists places_auth_insert on public.places;
drop policy if exists places_public_read on public.places;
drop policy if exists profiles_owner_update on public.profiles;
drop policy if exists profiles_public_read on public.profiles;
drop policy if exists review_reports_auth_insert on public.review_reports;
drop policy if exists review_reports_owner_read on public.review_reports;
drop policy if exists reviews_auth_insert on public.reviews;
drop policy if exists reviews_author_delete on public.reviews;
drop policy if exists reviews_author_update on public.reviews;
drop policy if exists reviews_public_read on public.reviews;

create policy places_public_read on public.places
  for select
  to anon, authenticated
  using (is_published = true);

create policy places_auth_insert on public.places
  for insert
  to authenticated
  with check ((select auth.uid()) is not null and is_published = true);

create policy profiles_owner_read on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_owner_update on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy favorites_owner_all on public.favorites
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy review_reports_auth_insert on public.review_reports
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy review_reports_owner_read on public.review_reports
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy reviews_public_read on public.reviews
  for select
  to anon, authenticated
  using (is_hidden = false);

create policy reviews_auth_insert on public.reviews
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and is_seed = false
    and is_hidden = false
  );

create policy reviews_author_update on public.reviews
  for update
  to authenticated
  using ((select auth.uid()) = user_id and is_seed = false)
  with check (
    (select auth.uid()) = user_id
    and is_seed = false
    and is_hidden = false
  );

create policy reviews_author_delete on public.reviews
  for delete
  to authenticated
  using ((select auth.uid()) = user_id and is_seed = false);

revoke all on all tables in schema public from anon, authenticated;

grant select on public.places to anon, authenticated;
grant select on public.reviews to anon, authenticated;

grant insert on public.places to authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert on public.review_reports to authenticated;

create or replace function public.get_places_with_ratings()
returns table(
  id uuid,
  slug text,
  name text,
  category_id public.category_id,
  address text,
  lat double precision,
  lng double precision,
  short_description text,
  sensory_overview text,
  best_times_to_visit text[],
  common_triggers text[],
  helpful_accommodations text[],
  parent_tips text[],
  seed_noise smallint,
  seed_crowdedness smallint,
  seed_staff_hospitality smallint,
  seed_lighting smallint,
  seed_parking smallint,
  seed_navigation smallint,
  seed_elevators smallint,
  seed_stairs smallint,
  seed_overall smallint,
  review_count bigint,
  community_review_count bigint,
  avg_noise numeric,
  avg_crowdedness numeric,
  avg_staff_hospitality numeric,
  avg_lighting numeric,
  avg_parking numeric,
  avg_navigation numeric,
  avg_elevators numeric,
  avg_stairs numeric,
  avg_overall numeric
)
language sql
stable
security definer
set search_path to ''
as $$
  select
    p.id, p.slug, p.name, p.category_id, p.address, p.lat, p.lng,
    p.short_description, p.sensory_overview,
    p.best_times_to_visit, p.common_triggers, p.helpful_accommodations, p.parent_tips,
    p.seed_noise, p.seed_crowdedness, p.seed_staff_hospitality,
    p.seed_lighting, p.seed_parking, p.seed_navigation,
    p.seed_elevators, p.seed_stairs, p.seed_overall,
    coalesce(s.review_count, 0),
    coalesce(s.community_review_count, 0),
    s.avg_noise, s.avg_crowdedness, s.avg_staff_hospitality,
    s.avg_lighting, s.avg_parking, s.avg_navigation,
    s.avg_elevators, s.avg_stairs, s.avg_overall
  from public.places p
  left join public.place_rating_summaries s on s.place_id = p.id
  where p.is_published = true
  order by p.name;
$$;

revoke execute on function public.get_places_with_ratings() from public;
grant execute on function public.get_places_with_ratings() to anon, authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
