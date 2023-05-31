import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


export default function Review({formData}) {
    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>
                Récapitulatif
            </Typography><br/>
            <Typography variant="body-h6">
                Départ le <b>{formData.departureDate.$d.toLocaleDateString()}</b> à <b>{formData.departureDate.$d.toLocaleTimeString()}</b>
            </Typography><br/>
            <Typography variant="body-h6">
                {formData.departure.formatted_address}
                {"  "}&rarr;{"  "}
                {formData.arrival.formatted_address}
            </Typography><br/>
            <Typography variant="body-h6">
                <b>{formData.seats}</b> places disponibles à <b>{formData.price}€</b> par place
            </Typography><br/>
            <Typography variant="body-h6">
                {formData.distance}  -  {formData.duration}
            </Typography>
        </React.Fragment>
    );
}