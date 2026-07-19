-- Store special low-sensory schedules separately from regular operating hours.
alter type public.tag_id add value if not exists 'sensory_friendly_hours';

alter table public.reviews
  add column if not exists sensory_friendly_hours text;

comment on column public.reviews.sensory_friendly_hours is
  'Community-reported recurring hours, dates, or classes with reduced sensory input.';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviews_sensory_friendly_hours_length'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews
      add constraint reviews_sensory_friendly_hours_length
      check (
        sensory_friendly_hours is null
        or char_length(btrim(sensory_friendly_hours)) between 3 and 500
      );
  end if;
end
$$;
