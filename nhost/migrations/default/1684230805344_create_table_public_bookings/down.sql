DROP TABLE IF EXISTS public.bookings;
DROP FUNCTION IF EXISTS public.get_nearby_trips(trip_row trips, startlat double precision, startlong double precision, endlat double precision, endlong double precision, bound integer);
