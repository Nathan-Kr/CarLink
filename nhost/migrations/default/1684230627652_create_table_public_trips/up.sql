CREATE TABLE public."trips" (id uuid DEFAULT public.gen_random_uuid() NOT NULL, driver_id uuid NOT NULL, departure_maps_id text NOT NULL, departure_lat decimal NOT NULL, departure_long decimal NOT NULL, arrival_maps_id text NOT NULL, arrival_lat decimal NOT NULL, arrival_long decimal NOT NULL, departure_time timestamptz NOT NULL, price_per_seat float4 NOT NULL, available_seat smallint NOT NULL, finished bool NOT NULL, PRIMARY KEY (id), FOREIGN KEY (driver_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE RESTRICT);
CREATE OR REPLACE FUNCTION public.get_nearby_trips(startlat double precision, startlong double precision, endlat double precision, endlong double precision, bound integer)
RETURNS SETOF trips
LANGUAGE sql
STABLE
AS $function$
SELECT id, driver_id, departure_maps_id, departure_lat, departure_long, arrival_maps_id, arrival_lat, arrival_long, departure_time, price_per_seat, available_seat, finished
FROM (
    SELECT *,
        SQRT(
            POW(69.1 * (departure_lat - startlat), 2) +
            POW(69.1 * (startlong - departure_long) * COS(departure_lat / 57.3), 2)
        ) AS distance_start,
        SQRT(
            POW(69.1 * (arrival_lat - endlat), 2) +
            POW(69.1 * (endlong - arrival_long) * COS(arrival_lat / 57.3), 2)
        ) AS distance_end
    FROM trips
) AS subquery
WHERE subquery.distance_start < bound AND subquery.distance_end < bound
ORDER BY subquery.distance_start;
$function$
