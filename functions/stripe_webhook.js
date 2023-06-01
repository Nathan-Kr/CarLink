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
      driver_id
    }
  }
}
`;

const GET_BALANCE = `query getBalance($id: uuid!) {
  balances(where: {user_id: {_eq: $id}}) {
    id
    balance
  }
}
`;

const INSERT_BALANCE = `mutation insertBalance($user_id: uuid!, $balance: Int!) {
  insert_balances_one(object: {user_id: $user_id, balance: $balance}){
    id
  }
}
`;

const UPDATE_BALANCE = `mutation updateBalance($user_id: uuid!, $balance: Int!) {
  update_balances_by_pk(pk_columns: {id: $id}, _set: {balance: $balance}){
    id
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
      const {data: mutation, error: mutationError} = await nhost.graphql.request(SET_PAYMENT, {
        id: booking,
      });
      if (mutationError) {
        console.log(mutationError)
        return res.status(500).json({ error: "Error updating booking" });
      }
      const {data: balance, error: balanceErrror} = await nhost.graphql.request(GET_BALANCE, {
        id: mutation.update_bookings_by_pk.trip.driver_id,
      });
      if (balanceErrror) {
        console.log(balanceErrror)
        return res.status(500).json({ error: "Error getting driver balance" });
      }
      if (balance.balances.length === 0){
        const {data: insert, error: insertError} = await nhost.graphql.request(INSERT_BALANCE, {
          user_id: mutation.update_bookings_by_pk.trip.driver_id,
          balance: event.data.object.amount_total / 100,
        });
      }else{
        const {data: update, error: updateError} = await nhost.graphql.request(UPDATE_BALANCE, {
          id: balance.balances[0].id,
          balance: balance.balances[0].balance + event.data.object.amount_total / 100,
        });
      }
  }
  else {
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  res.json({received: true});
};
  