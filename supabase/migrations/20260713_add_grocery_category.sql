alter type public.category_id add value if not exists 'grocery';

-- Retire categories that are no longer selectable while keeping existing places valid.
update public.places
set category_id = 'entertainment'
where category_id = 'tutoring';

update public.places
set category_id = 'retail'
where category_id = 'service';

-- This storage slot now represents elevator sensory comfort. Old stair-access
-- scores do not describe that experience, so start the new dimension unrated.
update public.places
set seed_stairs = null
where seed_stairs is not null;

update public.reviews
set rating_stairs = null
where rating_stairs is not null;
