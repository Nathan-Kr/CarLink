import { NhostClient } from "@nhost/nhost-js";
import Stripe from 'stripe';


const nhost = new NhostClient({
  backendUrl: process.env.NHOST_BACKEND_URL,
  adminSecret: process.env.NHOST_ADMIN_SECRET,
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const GET_BOOKING = `query MyQuery($id: uuid!) {
  bookings_by_pk(id: $id) {
    payment_status
    seats_booked
    passenger_id
    trip {
      id
      departure_address
      arrival_address
      price_per_seat
    }
    user {
      email
    }
  }
}
`;


const YOUR_DOMAIN = 'https://car.linkin.tw';

export default async (req, res) => {
    const booking = req.query.booking;

    if (!booking) {
        return res.status(500).json({ error: "No booking id provided" });
    }

    try{
      const { data, error } = await nhost.graphql.request(GET_BOOKING, {
        id: booking,
      });
      
      if (data?.bookings_by_pk?.payment_status === "pending") {
        const trip = data.bookings_by_pk.trip;
        const user = data.bookings_by_pk.user;
        const seats = data.bookings_by_pk.seats_booked;
        const session = await stripe.checkout.sessions.create({
          client_reference_id: booking,
          customer_email: user.email,
          line_items: [
            {
              price_data: {
                unit_amount: Number(trip.price_per_seat) * 100,
                currency: 'eur',
                product_data: {
                  name: trip.departure_address + " - " + trip.arrival_address,
                },
              },
              quantity: Number(seats),
            },
          ],
          mode: 'payment',
          success_url: `${YOUR_DOMAIN}/details?trip=${trip.id}&success=true`,
          cancel_url: `${YOUR_DOMAIN}/details?trip=${trip.id}&success=false`,
        });
      
        return res.redirect(303, session.url);
      }
      if(error){
        console.log(error.message)
      }
    } catch (e) {
      console.log(e);
    }

    return res.redirect(req.headers.referrer || req.headers.referer || YOUR_DOMAIN);

};
  