-- The legacy elevator-availability slot now represents non-elevator access.
-- Existing scores answer a different question, so start the new factor unrated.
update public.places
set seed_elevators = null
where seed_elevators is not null;

update public.reviews
set rating_elevators = null
where rating_elevators is not null;
