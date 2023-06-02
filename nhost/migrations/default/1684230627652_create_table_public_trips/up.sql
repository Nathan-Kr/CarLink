CREATE TABLE public."trips" (id uuid DEFAULT public.gen_random_uuid() NOT NULL, driver_id uuid NOT NULL, departure_address text NOT NULL, departure_lat decimal NOT NULL, departure_long decimal NOT NULL, arrival_address text NOT NULL, arrival_lat decimal NOT NULL, arrival_long decimal NOT NULL, departure_time timestamptz NOT NULL, price_per_seat float4 NOT NULL, available_seat smallint NOT NULL, finished bool DEFAULT false NOT NULL, PRIMARY KEY (id), FOREIGN KEY (driver_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE RESTRICT);
CREATE OR REPLACE FUNCTION public.get_nearby_trips(startlat double precision, startlong double precision, endlat double precision, endlong double precision, bound integer, departure_date date)
 RETURNS SETOF trips
 LANGUAGE sql
 STABLE
AS $function$
SELECT * FROM trips
WHERE 
SQRT(
    POW(111.2 * (departure_lat - startlat), 2) +
    POW(111.2* (startlong - departure_long) * COS(departure_lat / 57.3), 2)
) < bound
AND
SQRT(
    POW(111.2 * (arrival_lat - endlat), 2) +
    POW(111.2 * (endlong - arrival_long) * COS(arrival_lat / 57.3), 2)
) < bound
AND
trips.available_seat > (SELECT SUM(seats_booked) FROM bookings WHERE trip_id = trips.id)
AND
DATE_TRUNC('day', departure_time) = DATE_TRUNC('day', departure_date);
$function$
