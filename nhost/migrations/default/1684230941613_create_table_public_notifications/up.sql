CREATE TABLE public.notifications (id uuid DEFAULT public.gen_random_uuid() NOT NULL, user_id uuid NOT NULL, trip_id uuid NOT NULL, message text NOT NULL, red bool DEFAULT 'False' NOT NULL, timestamp timestamptz DEFAULT now() NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE RESTRICT, FOREIGN KEY (trip_id) REFERENCES public.trips (id) ON UPDATE RESTRICT ON DELETE RESTRICT);
