import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useState} from "react";

export default function Seats({formData, setFormData}) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
               Nombre de places disponibles
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <TextField
                        required
                        id="number"
                        value={formData.seats}
                        onChange={(e)=>setFormData({...formData, seats: e.target.value})}
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Box sx={{ display: 'flex', width: "100%", justifyContent: "space-between", mt: 2 }}>
                    {[1, 2, 3, 4, 5, 6].map((n) =>
                        <Button key={n} onClick={()=>setFormData({...formData, seats: n})}>
                            <Typography variant="h4">{n}</Typography>
                        </Button>)}
                </Box>
            </Grid>
        </React.Fragment>
    );
}