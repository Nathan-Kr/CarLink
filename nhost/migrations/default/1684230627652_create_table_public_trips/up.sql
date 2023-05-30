CREATE TABLE public."trips" (id uuid NOT NULL, driver_id uuid NOT NULL, departure_address text NOT NULL, arrival_address text NOT NULL, departure_time timestamptz NOT NULL, price_per_seat float4 NOT NULL, available_seat smallint NOT NULL, finished bool NOT NULL, PRIMARY KEY (id));
