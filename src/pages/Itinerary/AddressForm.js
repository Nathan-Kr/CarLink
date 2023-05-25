import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GoogleMapsAutocomplete from "../../components/Autocomplete";

export default function AddressForm({type, formData, setFormData}) {
    console.log(formData[type]?.description)
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Addresse {type === "departure" ? "de départ" : "d'arrivée"}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <GoogleMapsAutocomplete
                        underlined
                        placeholder={formData[type]?.description}
                        onPlaceChanged={(e)=>setFormData({...formData, [type]: e})}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}