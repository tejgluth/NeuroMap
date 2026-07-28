alter type public.category_id add value if not exists 'other';

-- Cafés are now represented by the Restaurant category.
update public.places
set category_id = 'restaurant'
where category_id = 'cafe';
