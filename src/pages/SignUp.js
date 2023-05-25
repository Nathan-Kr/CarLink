import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Link as RouterLink, useLocation} from "react-router-dom";
import mobileLogo from "../images/mobileLogo.png";
import logo from "../images/Logo.png";
import {Alert, useMediaQuery} from "@mui/material";
import {useSignUpEmailPassword} from "@nhost/react";

export default function SignUp() {
    let isMedium = useMediaQuery("(max-width:900px)");
    const {
        signUpEmailPassword,
        needsEmailVerification,
        isLoading,
        isSuccess,
        isError,
        error
    } = useSignUpEmailPassword()
    const location = useLocation();
    const from = location.state?.from?.pathname;
    console.log({ needsEmailVerification, isLoading, isSuccess, isError, error })
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        signUpEmailPassword(data.get('email'), data.get('password'),
            {
                displayName: data.get("firstName") + " " + data.get("lastName"),
                redirectTo: from || "/"
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <RouterLink to={"/"}>
                <img
                    style={{width: "10vw", position:"absolute", left: "2rem", top: "1rem"}}
                    src={isMedium ? mobileLogo : logo}
                    alt="logo"
                />
            </RouterLink>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'Info.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Inscription
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {isError && <Alert severity="error" sx={{mb: 2}}>{error.message}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="Prenom"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Nom"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Adresse mail"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="Je veux recevoir des mails de la part de CarLink"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    {needsEmailVerification && <Alert severity="success">Un email de confirmation vous a été envoyé pour terminer votre inscription&nbsp;
                        <Link component={RouterLink} to="/sign-in" variant="body2">
                            {"Se connecter"}
                        </Link>
                    </Alert>}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/sign-in" variant="body2">
                                {"Déjà un compte ? Se connecter"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}