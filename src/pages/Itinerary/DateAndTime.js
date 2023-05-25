import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {useEffect, useState} from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DatePicker, TimePicker} from "@mui/x-date-pickers";
import {tr} from "date-fns/locale";

const isToday = (someDate) => {
    if(!someDate) return false
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

export default function DateAndTime({formData, setFormData}) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Date et heure de départ
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <DatePicker className="departureDate"
                                    disablePast
                                    slotProps={{ textField: { fullWidth: true } }}
                                    value={formData.departureDate}
                                    onChange={e=>{
                                        if (isToday(e.$d)){
                                                e.$H = new Date().getHours()
                                                e.$m = new Date().getMinutes()
                                                e.$d = new Date()
                                        }
                                        setFormData({...formData, ['departureDate']: e})
                                    }}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TimePicker disablePast={isToday(formData.departureDate?.$d)}
                                    ampm={false}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    value={formData.departureDate}
                                    onChange={e=>setFormData({...formData, ['departureDate']: e})}/>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </React.Fragment>
    );
}