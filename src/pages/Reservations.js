import {
  Box,
  Container,
  Divider,
  useMediaQuery,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import ReactLoading from "react-loading";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/Logo.png";
import mobileLogo from "../images/mobileLogo.png";
import { gql, useQuery } from '@apollo/client'
import { useUserId } from '@nhost/react'
import TripDetails from "../components/TripDetails";

const GET_TRIPS = gql`
query getTrips($driver_id: uuid) {
  trips(where: {_or: [
    {bookings: {passenger_id: {_eq: $driver_id}}},
    {driver_id: {_eq: $driver_id}}
  ]}) {
    id
    driver_id
    departure_address
    departure_lat
    departure_long
    arrival_address
    arrival_lat
    arrival_long
    departure_time
    price_per_seat
    available_seat
    finished
    user {
      rating
      displayName
      reviews_count
    }
    bookings_aggregate {
      aggregate {
        sum {
          seats_booked
        }
      }
    }
  }
}
`;

const Reservations = () => {
  let isMobile = useMediaQuery("(max-width:850px)");
  const styles = {
    logo: {
      width: "6vw",
      marginRight: "3rem",
      minWidth: "6rem",
      ...(isMobile && {
        minWidth: "0.5rem ",
      }),
    },
    line: {
      borderTop: "1px solid rgb(230, 229, 229)",
      mb: "0px",
    },
  };
  const navigate = useNavigate();
  const userId = useUserId()
  const { loading, data, error } = useQuery(GET_TRIPS, {
    variables: { "driver_id": userId },
  });
  const trips = data?.trips

  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <Box>
          <Link to="/">
            <img
              style={styles.logo}
              src={isMobile ? mobileLogo : logo}
              alt="logo"
            ></img>
          </Link>
        </Box>
        <Box display="flex" alignItems="center">
          <Button />
        </Box>
      </Container>
      <Divider />
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          sx={{ mt: "2rem", mb: "2rem" }}
          color="initial"
        >
          Mes trajets
        </Typography>
        <Divider />

        {loading ? (
          <ReactLoading
            type="bubbles"
            color="  #EB4E5F"
            height={200}
            width={100}
          />
        ) : trips ? (
          <Box sx={{ mt: "2rem" }}>
            <Grid container spacing={0}>
              {trips?.map((trip) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    width: "350px  ",
                    height: "300px ",
                    p: "3rem",
                  }}
                >
                  <TripDetails trip={trip} isMobile={isMobile}/>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: "2rem", mb: "2rem" }}>
            <Typography variant="h5" color="initial" gutterBottom>
              No trips booked ... yet!
            </Typography>
            <Typography variant="subtitle1" color="gray" gutterBottom>
              Time to dust off your bags and start planning your next adventure
            </Typography>
            <Button
              onClick={() => navigate("/")}
              variant="outlined"
              sx={{
                color: "#d44957",
                borderColor: "#d44957",
                ":hover": {
                  borderColor: "#d44957",
                },
              }}
            >
              Start Searching
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Reservations;
