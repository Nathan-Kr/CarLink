import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function Price({formData, setFormData}) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Prix par place
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <TextField
                        required
                        id="number"
                        value={formData.price}
                        onChange={(e)=>setFormData({...formData, price: e.target.value})}
                        type="number"
                        fullWidth
                        variant="standard"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}