import React, { createRef, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/Logo.png";
import mobileLogo from "../../images/mobileLogo.png";
import ReactLoading from "react-loading";
import TripDetails from "../../components/TripDetails";
import { searchContext } from "../../Context";
import {
  Box, Button,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SwipeableEdgeDrawer from "./MobileDrawer";
import Home from "../Home";
import {Avatar} from "../../components/Avatar";
import { gql, useQuery } from '@apollo/client'
import {
  GoogleMap,
  Marker,
  DirectionsRenderer
} from '@react-google-maps/api'

const GET_TRIPS = gql`
query GetTrips($bound: Int, $endlat: float8, $startlat: float8, $startlong: float8, $endlong: float8) {
  get_nearby_trips(args: {bound: $bound, endlat: $endlat, endlong: $endlong, startlat: $startlat, startlong: $startlong}) {
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
  }
}`;

const Search = () => {
  let isMedium = useMediaQuery("(max-width:1350px)");
  let isMobile = useMediaQuery("(max-width:700px)");
  const {
    departure,
    setDeparture,
    arrival,
    setArrival,
    departureDate,
    setDepartureDate,
    passengers,
    setPassengers,
  } = useContext(searchContext);
  
  const [directions, setDirections] = useState(null);
  const [elRefs, setElRefs] = useState([]);
  const navigate = useNavigate();
  const directionsService = new window.google.maps.DirectionsService()
 
  if(departure.length === 0 || arrival.length === 0) {
    navigate("/");
  }
  useEffect(() => {
    directionsService.route(
      {
        origin: departure?.formatted_address,
        destination: arrival?.formatted_address,
        travelMode: window.google.maps.TravelMode.DRIVING
      }).then((response) => {
        setDirections(response)
      }).catch((e) => console.log(e))
  }, [departure, arrival])

  const { loading, data, error } = useQuery(GET_TRIPS, {
    variables: {
      "bound": 10, 
      "startlat": departure?.geometry?.location.lat(),
      "startlong": departure?.geometry?.location.lng(),
      "endlat": arrival?.geometry?.location.lat(),
      "endlong": arrival?.geometry?.location.lng()
    }
  });
  const trips = data?.get_nearby_trips
  
  
  

  const styles = {
    logo: {
      width: "8vw",
      marginRight: "3rem",
      minWidth: "1.5rem",
      ...(isMedium && { width: "3vw" }),
    },
    searchReminder: {
      width: "35rem",
      border: "1.5px solid rgb(242, 242, 242)",
      borderRadius: "100px",
      height: "3rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "2rem",
      paddingRight: "0.5rem",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      ...(isMobile && {
        display: "none",
      }),
      cursor: "pointer",
    },
    filter: {
      fontSize: "14px",
      fontWeight: "500",
      mr: "1.75rem",
    },
    vl: {
      position: "relative",
      top: "15",
      height: "20%",
      backgroundColor: "rgb(228, 228, 228)",
      width: "1.5px",
      marginRight: "20px",
      paddingBottom: "15px",
    },
    line: {
      borderTop: "1px solid rgb(230, 229, 229)",
      mb: "0px",
    },
    rentalsContent: {
      display: "flex",
      height: "calc(100vh - 121px)",
      ...(isMedium && {
        position: "relative",
        // overflow: "hidden",
        height: "5vh",
      }),
    },
    rentalsContentL: {
      width: "45%",
      padding: "30px",
      height: "calc(100vh - 11.5rem)",
      overflowY: "scroll",
      ...(isMedium && {
        width: "100vw",
        zIndex: 1,
        mt: "51vh",
      }),
    },
    line2: {
      borderTop: "0.5px solid rgb(230, 230, 230)",
      margin: "30px 0px",
    },

    rentalsContentR: {
      width: "55%",
      ...(isMedium && {
        width: "100vw",
        position: "absolute",
        left: 0,
        top: 10,
        height: "82vh",
        zIndex: 0,
      }),
    },
  };

  return (
    <Box style={{ height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "2rem",
          ...(isMedium && {
            p: 2,
          }),
        }}
      >
        <Box>
          <Link to="/">
            <img
              style={styles.logo}
              src={isMedium ? mobileLogo : logo}
              alt="logo"
            />
          </Link>
        </Box>
        <Box sx={styles.searchReminder} onClick={()=>navigate("/")}>
          <Typography variant="body1" sx={styles.filter}>
            {departure?.formatted_address}
          </Typography>
          <Box sx={styles.vl} />
          <Typography variant="body1" sx={styles.filter}>
            {arrival?.formatted_address}
          </Typography>
          <Box sx={styles.vl} />
          <Typography variant="body1" sx={styles.filter}>
            {departureDate}
          </Typography>
          <Box sx={styles.vl} />
          <Typography variant="body1" sx={styles.filter}>
            {passengers} Passagers
          </Typography>
        </Box>
        <Box display="flex">
          <Button />
            <Avatar color="#EB4E5F"/>
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Box display="flex">
          <Typography variant="overline">
            Temps de trajet estimé: <b>{directions?.routes[0]?.legs[0]?.duration?.text}</b> - Distance: <b>{directions?.routes[0]?.legs[0]?.distance?.text}</b>
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={styles.rentalsContent}>
        {isMedium ? (
          <SwipeableEdgeDrawer
            trips={trips}
            childClicked={null}
            isMobile={isMobile}
          />
        ) : (
          <Box variant="body1" sx={styles.rentalsContentL}>
            <Box>
              <Typography variant="body2" fontSize={15}>
                Trajets disponibles
              </Typography>
            </Box>
            {loading ? (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10vh",
                }}
              >
                <ReactLoading
                  type="bubbles"
                  color="  #EB4E5F"
                  height={200}
                  width={100}
                />
              </Box>
            ) : (
              trips.map((trip, i) => (
                <Box ref={elRefs[i]} key={i}>
                  {/* <hr style={styles.line2} /> */}
                  <Divider sx={{ margin: "30px 0px" }} />
                  <Box>
                    <TripDetails
                      trip={trip}
                      selected={Number(1) === i}
                      refProp={elRefs[i]}
                      isMobile={isMobile}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
        <Box sx={styles.rentalsContentR}>
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
      </Box>
    </Box>
  );
};

export default Search;
