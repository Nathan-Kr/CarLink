import React from "react";
import { Link } from "react-router-dom";
import { Rating, Button, Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import Icon from "antd/es/icon";

const TripDetails = ({ selected, trip, refProp, isMobile }) => {
  const isSmall = useMediaQuery("(max-width:420px)");
  console.log(trip);
  if (selected) {
    refProp?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#EB4E5F",
    },
  });

  const styles = {
    rentalDivH: {
      animation: "mymove 5s",
      borderRadius: "20px",
      "@keyframes mymove": {
        from: {
          backgroundColor: "#dddddd",
        },

        to: {
          backgroundColor: "#dddddd00",
        },
      },
    },

    rentalDiv: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      ...(isMobile && {
        flexDirection: "column",
      }),
    },
    rentalImg: {
      height: "200px",
      minWidth: "300px",
      borderRadius: "20px",
      marginRight: "20px",
      ...(isMobile && {
        width: "100%",
        m: 0,
        height: "300px",
      }),
      ...(isSmall && {
        height: "200px",
      }),
    },
    rentalInfo: {
      padding: "10px",
      width: "100%",
    },
    rentalTitle: {
      fontSize: "23px",
      marginBottom: "15px",
      ...(isMobile && {
        fontSize: "18px",
        mb: 1,
      }),
    },
    rentalDesc: {
      color: "gray",
      marginTop: "5px",
      ...(isMobile && {
        fontSize: "14px",
      }),
    },
    bottomButton: {
      marginTop: "20px",
      justifyContent: "space-between",
      display: "flex",
      width: "100%",
      alignItems: "center",
      ...(isMobile && {
        fontSize: "18px",
        mt: 1,
      }),
    },
    price: {
      display: "flex",
      justifyContent: "end",
      gap: "5px",
      color: "#808080",
      fontSize: "12px",
    },
  };

  return (
    <Box sx={selected && styles.rentalDivH}>
      <Box sx={styles.rentalDiv}>
        <img
          style={styles.rentalImg}
          src={"https://www.google.fr/url?sa=i&url=https%3A%2F%2Ffr.vecteezy.com%2Ffree-png-fr%2Fauto&psig=AOvVaw2RpylehhMkGp7bo9io_6au&ust=1685617073299000&source=images&cd=vfe&ved=0CA4QjRxqFwoTCJjQ2Yezn_8CFQAAAAAdAAAAABAD"}
          alt="place"
        />
        <Box sx={styles.rentalInfo}>
          <Box sx={styles.rentalTitle}>{trip.departure_maps_id}</Box>
          <Box sx={styles.rentalDesc}>
            {trip.departure_maps_id}
          </Box>
          <Box sx={styles.rentalDesc}>
            {trip.departure_maps_id}
          </Box>
          <Box
            style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              ...(isMobile && {
                justifyContent: "space-between",
              }),
            }}
          >
            <StyledRating
              name="read-only"
              size="small"
              value={Number(trip.rating)}
              readOnly
              precision={0.5}
            />
            <Box>
              <span
                style={{
                  marginLeft: "5px",
                  fontWeight: "bold",
                  ...(isMobile && {
                    fontSize: "14px",
                  }),
                }}
              >
                {Number(trip.rating)}
              </span>
              <span
                style={{
                  color: "gray",
                  marginLeft: "5px",
                  ...(isMobile && {
                    fontSize: "14px",
                  }),
                }}
              >
                ({trip.num_reviews} reviews)
              </span>
            </Box>
          </Box>
          <Box sx={styles.bottomButton}>
            <Link
              to={"/details"}
              style={{ textDecoration: "none" }}
              state={trip}
            >
              <Button
                size="small"
                variant="outlined"
                sx={{
                  color: "#d44957",
                  borderColor: "#d44957",
                  ":hover": {
                    borderColor: "#d44957",
                  },
                }}
              >
                Details
              </Button>
            </Link>
            <Box sx={styles.price}>
              {trip.rating ? Number(trip.rating) / 50 : 0.07} / Day
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TripDetails;
