import React from "react";
import { Link } from "react-router-dom";
import {Rating, Button, Box, useMediaQuery, Typography, CardActionArea, CardContent} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import NoCrashIcon from '@mui/icons-material/NoCrash';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Card from '@mui/material/Card';
import { useUserId } from "@nhost/react";


const TripDetails = ({ trip, isMobile, withDate = false }) => {
    const userId = useUserId();
    return (
          <CardActionArea component={Link}
              to={"/details?trip=" + trip.id}
              state={trip}
              sx={{ height: "100%", minHeight: "10rem" }}
          >
            <Card sx={{ display: 'flex', height: '100%'}}>
              <CardContent sx={{ display: 'flex', flexDirection:"column", justifyContent: 'space-between', height: '90%', width: '100%' }}>
                {<Typography variant={isMobile ? "body" : "button"}>
                  <EmojiFlagsIcon color="primary"/> {trip.departure_address}<br/>
                  <KeyboardArrowDownIcon/><br/>
                  <SportsScoreIcon color="secondary"/> {trip.arrival_address}
                </Typography>}
                <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      mt: "1rem"
                    }}
                >
                  {withDate&&<Typography variant="h6" color="text.secondary">
                    <CalendarTodayIcon sx={{fontSize: "1rem"}}/>&nbsp;
                    {new Date(trip.departure_time).toLocaleDateString()}
                  </Typography>}
                  <Typography variant="h6" color="text.secondary">
                    {trip.finished?
                      <NoCrashIcon sx={{fontSize: "1rem"}}/>:
                      <AccessTimeIcon sx={{fontSize: "1rem"}}/>}
                    &nbsp;
                    {trip.finished?
                      "Terminé":
                      new Date(trip.departure_time).toLocaleTimeString().slice(0,5)}
                  </Typography>
                    {trip.driver_id !== userId ?<Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="subtitle1" sx={{mr: 2}}>
                            {trip.user.displayName}
                        </Typography>
                        <Rating
                            name="read-only"
                            value={trip?.user?.rating}
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
                          {trip?.user?.rating}
                        </span>
                        <span
                            style={{color: "gray", marginLeft: "0.2rem", fontSize: "17px"}}
                        >
                          ({trip?.user?.reviews_count} notes)
                        </span>
                    </Box>:
                    <Typography variant="subtitle1">
                        votre trajet
                    </Typography>}
                  </Box>
              </CardContent>
            </Card>
          </CardActionArea>
    );
};

export default TripDetails;
