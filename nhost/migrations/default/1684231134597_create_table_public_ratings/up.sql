CREATE TABLE public.ratings (id uuid DEFAULT public.gen_random_uuid() NOT NULL, rater_id uuid NOT NULL, rated_id uuid NOT NULL, trip_id uuid NOT NULL, rating int2 NOT NULL, comment text NOT NULL, timestamp timestamp NOT NULL, PRIMARY KEY (id), FOREIGN KEY (rater_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE RESTRICT, FOREIGN KEY (rated_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE RESTRICT, FOREIGN KEY (trip_id) REFERENCES public.trips (id) ON UPDATE RESTRICT ON DELETE RESTRICT);
CREATE OR REPLACE FUNCTION public.user_reviews_count(user_row auth.users)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
    SELECT COUNT(*) FROM public.ratings WHERE rated_id = user_row.id;
$function$;
CREATE OR REPLACE FUNCTION public.user_rating(user_row auth.users)
 RETURNS numeric
 LANGUAGE sql
 STABLE
AS $function$
    SELECT AVG(rating) FROM public.ratings WHERE rated_id = user_row.id;
$function$;