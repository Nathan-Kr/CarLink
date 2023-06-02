import { NhostClient } from "@nhost/nhost-js";
import e from "express";
import Stripe from 'stripe';


const nhost = new NhostClient({
  backendUrl: process.env.NHOST_BACKEND_URL,
  adminSecret: process.env.NHOST_ADMIN_SECRET,
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const SET_PAYMENT = `mutation setPayment($id: uuid!) {
  update_bookings_by_pk(pk_columns: {id: $id}, _set: {payment_status: "success"}) {
    trip {
      id
      user {
        balance {
          id
          balance
        }
      }
    }
    user {
      displayName
    }
    seats_booked
  }
}
`;

const INSERT_BALANCE = `mutation insertBalance($user_id: uuid!, $balance: Int!) {
  insert_balances_one(object: {user_id: $user_id, balance: $balance}){
    id
  }
}
`;

const UPDATE_BALANCE = `mutation updateBalance($id: uuid!, $balance: Int!) {
  update_balances_by_pk(pk_columns: {id: $id}, _set: {balance: $balance}){
    id
  }
}
`;

const INSERT_NOTIFICATION = `mutation InsertNotifications($message: String, $trip_id: String, $user_id: String) {
  insert_notifications(objects: {message: $message, trip_id: $trip_id, user_id: $user_id}) {
    returning {
      id
    }
  }
}
`;

export default async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  }
  catch (err) {
    console.log(err)
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if(event.type === 'checkout.session.completed') {
      const booking = event.data.object.client_reference_id;
      const {data, error} = await nhost.graphql.request(SET_PAYMENT, {
        id: booking,
      });
      if (error) {
        console.log(error)
        return res.status(500).json({ error: "Error updating booking" });
      }
      
      if (data.update_bookings_by_pk.trip.user.balance.length === 0){
        const {data: insert, error: insertError} = await nhost.graphql.request(INSERT_BALANCE, {
          user_id: mutation.update_bookings_by_pk.trip.driver_id,
          balance: event.data.object.amount_total / 100,
        });
      }else{
        const {data: update, error: updateError} = await nhost.graphql.request(UPDATE_BALANCE, {
          id: data.update_bookings_by_pk.trip.user.balance.id,
          balance: data.update_bookings_by_pk.trip.user.balance.balance + event.data.object.amount_total / 100,
        });
      }
      const {data: notification, error: notificationError} = await nhost.graphql.request(INSERT_NOTIFICATION, {
        message: `${data.update_bookings_by_pk.user.displayName} souhaite réserver ${data.update_bookings_by_pk.seats_booked} places pour votre trajet`,
        trip_id: data.update_bookings_by_pk.trip.id,
        user_id: data.update_bookings_by_pk.trip.driver_id,
      });
  }
  else {
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  res.json({received: true});
};
  