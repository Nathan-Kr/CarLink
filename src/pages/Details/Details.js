import { LocalParkingOutlined, MeetingRoomOutlined, Spa } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  InputBase,
  Rating,
  TextField,
  Typography,
  Box,
  Divider,
  Container,
  useMediaQuery,
  Paper,
  IconButton, Button, Skeleton, Alert,
} from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { searchContext } from "../../Context";

import logo from "../../images/Logo.png";
import mobileLogo from "../../images/mobileLogo.png";
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNhostClient, useUserId } from "@nhost/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const ADD_BOOKING = gql`
mutation AddBooking($trip_id: uuid!, $seats_booked: smallint!) {
  insert_bookings_one(object: {trip_id: $trip_id, seats_booked: $seats_booked}) {
    id
  }
}
`;

const GET_TRIP = gql`
query GetTrip($id: uuid!) {
  trips_by_pk(id: $id) {
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

const GET_BOOKINGS = gql`
query getBookings($trip_id: uuid!, $user_id: uuid!) {
  bookings(where: {_and: [{trip_id: {_eq: $trip_id}}, {payment_status: {_eq: "success"}}, {trip: {driver_id: {_eq: $user_id}}}]}) {
    booking_status
    id
    passenger_id
    seats_booked
    user {
      displayName
    }
  }
}
`;

const GET_USER_BOOKINGS = gql`
query getUserBookings($trip_id: uuid!, $user_id: uuid!) {
  bookings(where: {_and: [{trip_id: {_eq: $trip_id}}, {passenger_id: {_eq: $user_id}}]}) {
    booking_status
    payment_status
    seats_booked
    id
  }
}
`;

const DELETE_USER_BOOKING = gql`
mutation MyMutation($id: uuid = "", $user_id: uuid = "") {
  delete_bookings_by_pk(id: $id) {
    trip_id
    trip {
      bookings(where: {passenger_id: {_eq: $user_id}}) {
        trip_id
        seats_booked
        payment_status
        passenger_id
        id
        booking_status
      }
    }
  }
}
`;


const Details = () => {
  let isMobile = useMediaQuery("(max-width:850px)");
  const userId = useUserId();
  const nhost = useNhostClient();
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    departure,
    setDeparture,
    arrival,
    setArrival,
    departureDate,
    setDepartureDate,
    passengers,
    setPassengers,
    directions,
    setDirections,
  } = useContext(searchContext);

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#EB4E5F",
    },
  });
  
  const [deleteModal, setDeleteModal] = React.useState(null);
  const [cancelModal, setCancelModal] = React.useState(false);
  const [tripData, setTripData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const { state: trip } = useLocation();

  const error = searchParams.get("success") === "false" || bookings.find((booking) => booking.payment_status === "pending");
  const success = searchParams.get("success") === "true";
  console.log(bookings.find((booking) => booking.booking_status === "pending"))
  const [ AddBooking, { data: bookingData, loading: bookingLoading, error: bookingError }]  = useMutation(ADD_BOOKING, {
    variables: { trip_id: tripData?.id, seats_booked: passengers},
  });
  
  useEffect(() => {
    if(trip) {
      setTripData(trip);
    } else {
      nhost.graphql.request(GET_TRIP, { id: searchParams.get("trip") }).then(({ data }) => {
        setTripData(data.trips_by_pk);
      });
    }
  }, [trip, searchParams]);

  useEffect(() => {
    if(!tripData) return;
    setDirections(null);
    const directionsService = new window.google.maps.DirectionsService()
    directionsService.route(
      {
        origin: tripData.departure_address,
        destination: tripData.arrival_address,
        travelMode: window.google.maps.TravelMode.DRIVING
      }).then((response) => {
        setDirections(response)
      }).catch((e) => console.log(e))
  }, [tripData])

  useEffect(() => {
    if(tripData && userId) {
      nhost.graphql.request(tripData?.driver_id === userId ? GET_BOOKINGS : GET_USER_BOOKINGS, { trip_id: tripData.id, user_id: userId }).then(({ data }) => {
        setBookings(data?.bookings || []);
      });
    }
  }, [tripData, userId]);

  useEffect(() => {
    if(bookingData?.insert_bookings_one?.id) {
      window.location.replace(`${nhost.functions.url}/payment?booking=${bookingData.insert_bookings_one.id}`);
    }
  }, [bookingData]);

  const handleBooking = (id) => {
    setPendingRedirect(true);
    window.location.replace(`${nhost.functions.url}/payment?booking=${id}`);
  }

  const removeBooking = () => {
    nhost.graphql.request(DELETE_USER_BOOKING, { id: deleteModal, user_id: userId }).then(({ data }) => {
      setBookings(data.delete_bookings_by_pk.trip.bookings);
    });
  }


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
    map_div: {
      width: "100%",
      height: "40vh",
      marginBottom: "1rem",
    },
    card: {
      padding: "1.5rem",
      width: "30%",
      height: "fit-content",
      border: "1.5px solid rgb(242, 242, 242)",
      borderRadius: "15px",
      boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 20px",
      mb: 4,
    },
    card_top: {
      display: "flex",
      marginTop: "1.5rem",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price_div: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "black",
      marginLeft: "10px",
    },
    card_rating: {
      alignItems: "center",
      display: "flex",
    },
    description: {
      mt: 2,
    },
    input: {
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.842)",
      margin: 1,
      height: "2.75rem",
    },
  };


  const alert = success || error

  return (
    <Box>
    <Dialog
        open={deleteModal !== null}
        onClose={()=>{setDeleteModal(null)}}
      >
      <DialogTitle>
        {"Etes vous sûr de vouloir annuler ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Après l'annulation de votre réservation, vous receverez un remboursement de 100% du prix de votre réservation dans un délai de 5 jours ouvrables.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={()=>{setDeleteModal(null)}}>retour</Button>
        <Button onClick={()=>{
          removeBooking()
          setDeleteModal(null)
        }} autoFocus>
          Annuler la reservation
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog
        open={cancelModal}
        onClose={()=>{setCancelModal(false)}}
      >
      <DialogTitle>
        {"Etes vous sûr de vouloir annuler ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Après l'annulation de votre trajet, votre balance sera debité et les Passagers seront remboursés.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={()=>{setCancelModal(false)}}>retour</Button>
        <Button onClick={()=>{
          //removeBooking()
          setCancelModal(false)
        }} autoFocus>
          Annuler le trajet
        </Button>
      </DialogActions>
    </Dialog>
    <Container
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
        <Avatar color="primary"/>
      </Container>
      <Divider />
      <Container
        sx={{ mt: 2 }}
        // style={{ margin: "0 15vw 0 15vw", marginTop: "2vh" }}
      >
      {tripData ?
        <Typography variant={isMobile ? "h6" : "h5"}>
          <EmojiFlagsIcon color="primary"/> {tripData.departure_address}<br/>
          <KeyboardArrowDownIcon/><br/>
          <SportsScoreIcon color="secondary"/> {tripData.arrival_address}
        </Typography>
        :
        <Typography variant={isMobile ? "h6" : "h5"}>
          <Skeleton variant="text"/><br/><br/>
          <Skeleton variant="text"/>
        </Typography>
      }
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: "2rem",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "60%",
              ...(isMobile && {
                width: "100%",
                mb: 4,
              }),
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"}>
              {tripData?.user?.displayName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                width: "100%",
              }}>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "20px",
                  marginTop: 2,
                }}
              >
                <StyledRating
                  name="read-only"
                  value={tripData?.user?.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "15px",
                  }}
                >
                  {tripData?.user?.rating}
                </span>
                <span
                  style={{ color: "gray", marginLeft: "0.2rem", fontSize: "17px" }}
                >
                  ({tripData?.user?.reviews_count} notes)
                </span>
              </Box>
              <Typography>
                  <CalendarTodayIcon fontSize="small" /> Départ le {tripData?(new Date(tripData.departure_time).toLocaleDateString() +  ' à ' + new Date(tripData.departure_time).toLocaleTimeString()):<Skeleton variant="text"/>}
              </Typography>
            </Box>
            <Divider sx={{ mt: 3, mb: 3 }} />
            <Box sx={styles.map_div}>
              <GoogleMap
                zoom={5}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {directions && (
                  <DirectionsRenderer directions={directions} />
                )}
              </GoogleMap>
            </Box>
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Typography variant="overline">
                Temps de trajet estimé: <b>{directions?.routes[0]?.legs[0]?.duration?.text}</b> - Distance: <b>{directions?.routes[0]?.legs[0]?.distance?.text}</b>
              </Typography>
            </Box>
            <Divider sx={{ mt: 3, mb: 3 }} />
            <Box display="flex" sx={{ mb: 2 }}>
              <AirlineSeatReclineNormalIcon />
              <Typography variant="body1" color="initial" sx={{ ml: 2 }}>
                {tripData ? (tripData.available_seat - tripData.bookings_aggregate.aggregate.sum.seats_booked) : ''} places disponibles (total {tripData?.available_seat || ''})
              </Typography>
            </Box>
            <Divider sx={{ mt: 3, mb: 3 }} />
            <Box display="flex" sx={{ mb: 2 }}>
              <CreditCardIcon />
              <Typography variant="body1" color="initial" sx={{ ml: 2 }}>
                Paiement en ligne
              </Typography>
            </Box>
            <Divider sx={{ mt: 3, mb: 3 }} />
          
          </Box><br/>
          {isMobile ? (
            <Paper
              sx={{
                display: "flex",
                position: "fixed",
                justifyContent: "space-between",
                alignItems: "center",
                bottom: 0,
                width: "100%",
                p: 3,
                ml: -3,
              }}
            >
              {alert?<Alert severity={error?"error":"success"} sx={{mb: 2}}>
                    {error && "Vous avez annulé le paiement"}
                    {success && "Votre reservation a été effectuée avec succès, vous pouvez la consulter "}
                    {success && <Link to="/account/reservations">sur cette page</Link>}
              </Alert>:
              <React.Fragment>
              <TextField
                      value={passengers}
                      label="Passagers"
                      onChange={(e) => setPassengers(e.target.value)}
                      type="number"
                      variant="standard"
                      inputProps={{ min: 1, max: tripData?.available_seat || 1 }}
                      sx={{ width: "30%" }}
                    />
              <LoadingButton
                disabled={bookingLoading || error || passengers > tripData?.available_seat - tripData.bookings_aggregate.aggregate.sum.seats_booked || passengers < 1}
                loading={pendingRedirect}
                onClick={(e)=>{
                  e.preventDefault()
                  setPendingRedirect(true)
                  AddBooking()
                }}
                sx={{
                  color: "#fff",
                  bgcolor: "#d44957",
                  borderRadius: "0.2rem",
                  mr: 4,
                  ":hover": {
                    backgroundColor: "#b4414c",
                  },
                }}
              >
                Réserver et payer
              </LoadingButton>
              </React.Fragment>}
            </Paper>
          ) : (
            <Box sx={styles.card}>
            {bookings&&<Typography variant="h6" color="initial">Vos réservations: </Typography>}
            {bookings.map((booking, index) => (
              <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mt: "1rem"}}>
                <Typography variant="body1" color="initial">
                  {booking?.user?.displayName} &bull; {booking.seats_booked} place{booking.seats_booked > 1 && "s"}
                </Typography>
                {booking.payment_status === "pending" && 
                  <Button variant="outlined" color="warning" 
                          sx={{mr: 2}}
                          onClick={()=>handleBooking(booking.id)}>
                    Payer
                  </Button>}
                {booking?.payment_status&&<Button variant="outlined" color="error" onClick={()=>setDeleteModal(booking.id)}>
                  Annuler
                </Button>}
                </Box>
            ))}
            {bookings && <Divider sx={{ mt: 3, mb: 3 }} />}
            {tripData?.driver_id === userId && 
              <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                <Button variant="outlined" color="error" onClick={()=>setCancelModal(true)}>Annuler le trajet</Button>
              </Box>
            }
            {userId !== tripData?.driver_id &&
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
              <Typography variant="h6" color="initial">Nouvelle réservation: </Typography>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2.75rem",
                    marginTop: "1.75rem",
                  }}
                >
                  <Box style={styles.input}>
                      <TextField
                      value={passengers}
                      label="Passagers"
                      onChange={(e) => setPassengers(e.target.value)}
                      type="number"
                      variant="standard"
                      inputProps={{ min: 1, max: tripData?.available_seat || 1 }}
                      sx={{ padding: "5px" }}
                    />
                  </Box>
                  <Typography>
                    x {tripData?.price_per_seat || ''} €
                  </Typography>
                </Box>
                <Divider sx={{ mb: "1.75rem" }} />
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1.75rem",
                  }}
                >
                  <Typography variant="h6" color="initial">
                    Total :
                  </Typography>
                  {tripData?
                    <Typography>
                    {tripData.price_per_seat * passengers} €
                  </Typography>:
                  <Skeleton variant="text"/>}
                </Box>
                {alert&&<Alert severity={error?"error":"success"} sx={{mb: 2}}>
                  {error && "Vous avez annulé le paiement, vous pouvez annuler votre reservation ou reessayer"}
                  {success && "Votre reservation a été effectuée avec succès, vous pouvez la consulter "}
                  {success && <Link to="/account/reservations">sur cette page</Link>}
                </Alert>}
                <LoadingButton
                  fullWidth
                  disabled={bookingLoading || alert}
                  loading={pendingRedirect}
                  onClick={(e)=>{
                    e.preventDefault()
                    setPendingRedirect(true)
                    AddBooking()
                  }}
                  variant="text"
                  sx={{
                    color: "#fff",
                    bgcolor: "#d44957",
                    borderRadius: "0.5rem",
                    ":hover": {
                      backgroundColor: "#b4414c",
                    },
                  }}
                >
                  Réserver et payer
                </LoadingButton>
              </Box>}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Details;
