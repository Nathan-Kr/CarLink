import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import Price from './Price';
import Review from './Review';
import mobileLogo from "../../images/mobileLogo.png";
import logo from "../../images/Logo.png";
import {Link as RouterLink} from "react-router-dom";
import {useMediaQuery} from "@mui/material";
import Seats from "./Seats";
import DateAndTime from "./DateAndTime";
import {useEffect, useState} from "react";
import { gql, useMutation } from '@apollo/client'
import LinearProgress from '@mui/material/LinearProgress';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer
} from '@react-google-maps/api'

const steps = ['Date', 'Départ', 'Arrivée', 'Places', 'Prix', 'Confirmation'];

const ADD_TRIP = gql`
mutation AddTrip($trip: trips_insert_input!) {
  insert_trips(objects: [$trip]){returning {id}}
}
`;

export default function Itinerary() {
  let isMedium = useMediaQuery("(max-width:900px)");
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [ addTrip, { data, loading, error }] = useMutation(ADD_TRIP)

  const [activeStep, setActiveStep] = React.useState(0);

  const [formData, setFormData] = React.useState({
    "departure": null,
    "arrival": null,
    "departureDate": null,
    "seats": 4,
    "price": 15,
    "distance": "",
    "duration": "",
  });

  const directionsService = new window.google.maps.DirectionsService()
  
  useEffect(() => {
    if (formData.departure && formData.arrival) {
      directionsService.route({
        origin: formData.departure?.formatted_address,
        destination: formData.arrival?.formatted_address,
        // eslint-disable-next-line no-undef
        travelMode: window.google.maps.TravelMode.DRIVING,
      }).then((results) => {
        console.log(results)
        setDirectionsResponse(results)
        setFormData({...formData,
          "distance": results.routes[0].legs[0].distance.text,
          "duration": results.routes[0].legs[0].duration.text
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }, [formData.departure, formData.arrival])

  useEffect(() => {
    if (activeStep === steps.length) {
      addTrip({
        variables: {
          trip: {
            departure_address: formData.departure?.place_id,
            departure_lat: formData.departure?.geometry?.location?.lat(),
            departure_long: formData.departure?.geometry?.location?.lng(),
            arrival_address: formData.arrival?.place_id,
            arrival_lat: formData.arrival?.geometry?.location?.lat(),
            arrival_long: formData.arrival?.geometry?.location?.lng(),
            departure_time: formData?.departureDate?.$d?.toISOString(),
            price_per_seat: formData.price,
            available_seat: formData.seats,
          }
        }
        })
    }
  }, [activeStep])


  function getStepContent(step) {
    switch (step) {
      case 0:
        return <DateAndTime formData={formData} setFormData={setFormData}/>;
      case 1:
        return <AddressForm type="departure" key={"departure"} formData={formData} setFormData={setFormData}/>;
      case 2:
        return <AddressForm type="arrival" key={"arrival"} formData={formData} setFormData={setFormData}/>;
      case 3:
        return <Seats formData={formData} setFormData={setFormData}/>;
      case 4:
        return <Price formData={formData} setFormData={setFormData}/>;
      case 5:
        return <Review formData={formData}/>;
      default:
        throw new Error('Unknown step');
    }
  }

  function buttonEnabled(step) {
    switch (step) {
      case 0:
        return formData.departureDate !== null;
      case 1:
        return formData.departure !== "null";
      case 2:
        return formData.arrival !== "null";
      case 3:
        return formData.seats !== 0;
      case 4:
        return formData.price !== 0;
      case 5:
        return true;
      default:
        throw new Error('Unknown step');
    }
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };


  return (
      <Box>
        <Box>
          <RouterLink to={"/"}>
            <img
                style={{width: "10vw", position:"absolute", left: "2rem", top: "1rem"}}
                src={isMedium ? mobileLogo : logo}
                alt="logo"
            />
          </RouterLink>
          &nbsp;
        </Box>
        <Container component="main" maxWidth="md" sx={{ mt: 5}}>
          <CssBaseline />
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Nouvel itinéraire
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                {loading ? 
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box>:
                <Typography variant="h5" gutterBottom>
                  En route !
                </Typography>}
                <Container sx={{height: "15vh"}}>
                  {!loading&&<Typography variant="subtitle1">
                    Nous avons publié votre itinéraire. Vous pouvez le consulter dans la section&nbsp;
                    <Link component={RouterLink} to="/account/reservations" variant="body2">
                      {"Mes itinéraires"}
                    </Link>
                  </Typography>}
                </Container>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Container sx={{height: "15vh"}}>
                  {getStepContent(activeStep)}
                </Container>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Retour
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!buttonEnabled(activeStep)}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Publier' : 'Suivant'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Paper>
          <div style={{ height: '40vh', width: '100%' }}>

          <GoogleMap
          zoom={5}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            center: !formData.arrival && { lat: formData.departure?.geometry?.location?.lat() || 48.856614, lng: formData.departure?.geometry?.location?.lng() || 2.3522219 },
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {formData.departure && <Marker position={{ lat: formData.departure.geometry.location.lat(), lng: formData.departure.geometry.location.lng() }} />}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        </div>
        </Container>
      </Box>
  );
}