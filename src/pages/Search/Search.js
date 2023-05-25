import React, { createRef, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/Logo.png";
import mobileLogo from "../../images/mobileLogo.png";
import ReactLoading from "react-loading";
import Map from "../../components/Map";
import PlaceDetails from "../../components/PlaceDetails";
import { searchContext } from "../../Context";
import {
  Box, Button,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SwipeableEdgeDrawer from "../../components/MobileDrawer";
import Home from "../Home";
import {Avatar} from "../../components/Avatar";
const Search = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
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

  const [elRefs, setElRefs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if(departure.length === 0 || arrival.length === 0) {
      navigate("/");
    }
  }, [departure, arrival, departureDate, passengers]);

  if(!departure || !arrival) {
    return <></>
  }

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
          <Typography varient="body1" sx={styles.filter}>
            {departure?.description}
          </Typography>
          <Box sx={styles.vl} />
          <Typography varient="body1" sx={styles.filter}>
            {arrival?.description}
          </Typography>
          <Box sx={styles.vl} />
          <Typography varient="body1" sx={styles.filter}>
            {departureDate}
          </Typography>
          <Box sx={styles.vl} />
          <Typography varient="body1" sx={styles.filter}>
            {passengers} Passagers
          </Typography>
        </Box>
        <Box display="flex">
          <Button />
            <Avatar color="#EB4E5F"/>
        </Box>
      </Box>

      {/* <hr style={styles.line} /> */}
      <Divider />
      <Box sx={styles.rentalsContent}>
        {isMedium ? (
          <SwipeableEdgeDrawer
            places={[]}
            childClicked={null}
            isMobile={isMobile}
          />
        ) : (
          <Box varient="body1" sx={styles.rentalsContentL}>
            <Box>
              <Typography varient="body2" fontSize={15}>
                Trajets disponibles
              </Typography>
            </Box>
            {true ? (
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
              [].map((place, i) => (
                <Box ref={elRefs[i]} key={i}>
                  {/* <hr style={styles.line2} /> */}
                  <Divider sx={{ margin: "30px 0px" }} />
                  <Box>
                    <PlaceDetails
                      place={place}
                      selected={Number(1) === i}
                      refProp={elRefs[i]}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
        <Box sx={styles.rentalsContentR}>
          <Map
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Search;
