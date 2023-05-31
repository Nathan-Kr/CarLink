import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import bg from "../images/homeBg.jpg";
import mobileLogo from "../images/mobileLogo.png";
import logo from "../images/LogoWhite.png";
import SearchIcon from "@mui/icons-material/Search";
import GoogleMapsAutocomplete from "../components/Autocomplete";
import {
    Box,
    InputBase,
    TextField,
    Typography,
    useMediaQuery,
    IconButton, Button,
} from "@mui/material";
import {searchContext, searchFilterContext} from "../Context";
import PersonIcon from "@mui/icons-material/Person";
import {Avatar} from "../components/Avatar";
import {Link as RouterLink} from "react-router-dom";

const Home = ({onLoad, onPlaceChanged}) => {
    let isMedium = useMediaQuery("(max-width:900px)");
    let isMobile = useMediaQuery("(max-width:750px)");

    const {
        departure,
        setDeparture,
        arrival,
        setArrival,
        departureDate,
        setDepartureDate,
        passengers,
        setPassengers
    } = useContext(searchContext);

    const navigate = useNavigate();

    const styles = {
        banner: {
            background: `url(${bg}) center center/cover no-repeat`,
            height: "100vh",
            width: "100%",
            opacity: 1,
            zIndex: -1,
            position: "absolute",
            top: 0,
            left: 0,
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "linear-gradient(rgb(0,0,0,0.8), rgb(0,0,0,0.3))",

                opacity: 0.7,
                zIndex: -10,
            },
        },

        tabs: {
            color: "white",
            display: "flex",
            justifyContent: "center",
            gap: "5rem",
            width: "100vw",
            ...(isMedium && {
                position: "absolute",
                top: "10rem",
                left: "1rem",
            }),
            ...(isMobile && {
                display: "none",
            }),
        },
        searchFields: {
            backgroundColor: "white",
            height: "65px",
            borderRadius: "100rem",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingLeft: "30px",
            width: "45rem",

            ...(isMedium && {
                position: "absolute",
                top: "15rem",

                width: "80vw",
            }),
            ...(isMobile && {
                position: "absolute",
                top: "10rem",
                p: 1,
                width: "70vw",
                flexDirection: "column",
                height: "45vh",
                borderRadius: "1rem",
            }),
        },
        inputs: {
            fontSize: "12px",
            fontWeight: "bold",
            mt: "10px",
            width: "10rem",
            ...(isMobile && {
                width: "80%",
            }),
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
        hl: {
            position: "relative",
            top: "20px",

            backgroundColor: "rgb(228, 228, 228)",
            width: "100%",
            mt: "-2rem",
            mb: "1rem",
            paddingBottom: "1px",
        },
    };

    return (
        <Box sx={styles.banner}>
            <img
                style={{width: "10vw", position:"absolute", left: "2rem", top: "1rem"}}
                src={isMedium ? mobileLogo : logo}
                alt="logo"
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "2rem",
                    ...(isMedium && {
                        p: "1rem",
                    }),
                }}
            >
                <Box sx={styles.tabs}>
                    <Typography
                        variant="subtitle1"
                        sx={{pb: "5px", borderBottom: "2px solid white", cursor: "pointer"}}
                        onClick={() => navigate("/")}
                    >
                        Rechercher un trajet
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate("/account/itinerary")}
                    >
                        Proposer un trajet
                    </Typography>
                </Box>
                <Box style={{width: "10vw", position:"absolute", right: "2rem", top: "2rem"}}>
                    <Avatar color="#fff"/>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center">
                <Box sx={styles.searchFields}>
                    <Box sx={styles.inputs}>
                        Départ
                        <GoogleMapsAutocomplete
                            onPlaceChanged={setDeparture}
                            variant="standard"
                            placeholder={departure?.formatted_address || "D'où partez-vous?"}
                        />
                    </Box>
                    <Box sx={isMobile ? styles.hl : styles.vl}/>
                    <Box sx={styles.inputs}>
                        Arrivée
                        <GoogleMapsAutocomplete
                            onPlaceChanged={setArrival}
                            variant="standard"
                            placeholder={arrival?.formatted_address || "Où allez-vous?"}
                        />
                    </Box>
                    <Box sx={isMobile ? styles.hl : styles.vl}/>
                    <Box sx={styles.inputs}>
                        Quand
                        <TextField
                            variant="standard"
                            type="date"
                            fullWidth
                            InputProps={{disableUnderline: true}}
                            onChange={(e) => {
                                setDepartureDate(e.target.value);
                            }}
                            value={departureDate}
                        />
                    </Box>

                    <Box sx={isMobile ? styles.hl : styles.vl}/>
                    <Box sx={styles.inputs}>
                        Passagers
                        {isMobile && <br/>}
                        <InputBase
                            type="number"
                            fullWidth
                            inputProps={{min: 1}}
                            onChange={(e) => setPassengers(e.target.value)}
                            value={passengers}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: ((arrival && departure) ? "#EB4E5F": "grey"),
                            padding: "5px",
                            borderRadius: "60%",
                            marginRight: "5px",
                            ...(isMobile && {
                                width: "60vw",
                                borderRadius: "0.5rem",
                                justifyContent: "center",
                            }),
                        }}

                    >
                        <IconButton disabled={!(arrival && departure)} onClick={()=>navigate('/search')}>
                            <SearchIcon
                                sx={{
                                    color: "white",
                                    ...(isMobile && {
                                        mr: 2,
                                    }),
                                }}
                            />
                            {isMobile && (
                                <Typography variant="body1" color="white">
                                    Search
                                </Typography>
                            )}
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    color: "white",
                    mt: "35vh",
                    ml: "10vw",
                    width: "20rem",
                    ...(isMobile && {
                        width: "10rem",
                        mt: "65vh",
                        ml: "2rem",
                    }),
                }}
            >
                <Typography variant={isMobile ? "h6" : "h4"}>
                    Recherchez, cliquez et réservez !
                </Typography>
                <Typography variant={isMobile ? "subtitile1" : "body1"}>
                    Où que vous alliez, trouvez le trajet idéal parmi notre large choix de destinations à petits prix.
                </Typography>
            </Box>
        </Box>
    );
};

export default Home;
