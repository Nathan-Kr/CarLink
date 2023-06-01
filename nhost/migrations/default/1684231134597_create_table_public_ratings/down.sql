DROP TABLE IF EXISTS public.ratings;
DROP FUNCTION IF EXISTS public.user_reviews_count(user_row auth.users);
DROP FUNCTION IF EXISTS public.user_rating(user_row auth.users);