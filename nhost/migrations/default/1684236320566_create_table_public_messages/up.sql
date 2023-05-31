CREATE TABLE public.messages (id uuid DEFAULT public.gen_random_uuid() NOT NULL, sender_id uuid NOT NULL, receiver_id uuid NOT NULL, trip_id uuid NOT NULL, content text NOT NULL, timestamp timestamp NOT NULL, PRIMARY KEY (id), FOREIGN KEY (sender_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (receiver_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (trip_id) REFERENCES public.trips (id) ON UPDATE CASCADE ON DELETE CASCADE);
