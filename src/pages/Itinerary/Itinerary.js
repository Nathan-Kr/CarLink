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
import {useEffect} from "react";

const steps = ['Date', 'Départ', 'Arrivée', 'Places', 'Prix', 'Confirmation'];

export default function Itinerary() {
  let isMedium = useMediaQuery("(max-width:900px)");

  const [activeStep, setActiveStep] = React.useState(5);

  const [formData, setFormData] = React.useState({
    "departure": {"description": "blf"},
    "arrival": {"description": "blf"},
    "departureDate": {"$d": new Date()},
    "seats": 4,
    "price": 15,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
        <Container component="main" maxWidth="md" sx={{ mt: 5 }}>
          <CssBaseline />
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Nouvel itinérarire
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
                <Typography variant="h5" gutterBottom>
                  En route !
                </Typography>
                <Typography variant="subtitle1">
                  Nous avons publié votre itinéraire. Vous pouvez le consulter dans la section&nbsp;
                  <Link component={RouterLink} to="/account/reservations" variant="body2">
                    {"Mes itinéraires"}
                  </Link>
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Retour
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Publier' : 'Suivant'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Paper>
        </Container>
      </Box>
  );
}