create or replace function public.rename_review_place(
  target_review_id uuid,
  new_name text
)
returns void
language plpgsql
security definer
set search_path to ''
as $$
declare
  target_place_id uuid;
  visible_review_count integer;
  trimmed_name text;
  base_slug text;
  next_slug text;
begin
  trimmed_name := nullif(btrim(new_name), '');

  if trimmed_name is null or char_length(trimmed_name) < 2 then
    raise exception 'Place name must be at least 2 characters.';
  end if;

  select r.place_id
    into target_place_id
  from public.reviews r
  where r.id = target_review_id
    and r.user_id = auth.uid()
    and r.is_seed = false
    and r.is_hidden = false;

  if target_place_id is null then
    raise exception 'Review not found or you do not have permission to edit it.';
  end if;

  if not exists (
    select 1
    from public.places p
    where p.id = target_place_id
      and p.seed_noise is null
      and p.seed_crowdedness is null
      and p.seed_staff_hospitality is null
      and p.seed_lighting is null
      and p.seed_parking is null
      and p.seed_navigation is null
      and p.seed_elevators is null
      and p.seed_stairs is null
      and p.seed_overall is null
  ) then
    raise exception 'This place is already listed on NeuroMaps and cannot be renamed from a review.';
  end if;

  select count(*)
    into visible_review_count
  from public.reviews r
  where r.place_id = target_place_id
    and r.is_seed = false
    and r.is_hidden = false;

  if visible_review_count <> 1 then
    raise exception 'This place has multiple community reviews, so renaming requires review by NeuroMaps.';
  end if;

  base_slug := regexp_replace(lower(trimmed_name), '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-+|-+$)', '', 'g');
  if base_slug = '' then
    base_slug := 'place';
  end if;
  next_slug := base_slug || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 6);

  update public.places
  set
    name = trimmed_name,
    slug = next_slug,
    updated_at = now()
  where id = target_place_id;
end;
$$;

revoke execute on function public.rename_review_place(uuid, text) from public, anon;
grant execute on function public.rename_review_place(uuid, text) to authenticated;
