import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Alert} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import background from '../images/signup-bg.jpg';
import {useLocation, useNavigate} from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import mobileLogo from "../images/mobileLogo.png";
import logo from "../images/Logo.png";
import {useMediaQuery} from "@mui/material";
import {useSignInEmailPassword} from "@nhost/react";
import {useEffect} from "react";



export default function SignInSide() {
    let isMedium = useMediaQuery("(max-width:900px)");
    const location = useLocation();
    const from = location.state?.from?.pathname;

    const {
        signInEmailPassword,
        needsEmailVerification,
        isLoading,
        isSuccess,
        isError,
        error
    } = useSignInEmailPassword()
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        signInEmailPassword(data.get('email'), data.get('password'))
    };

    useEffect(() => {
        if (isSuccess) {
            navigate(from || "/");
        }
    }, [isSuccess])

    return (
        <Box>
        <RouterLink to={"/"}>
            <img
                style={{width: "10vw", position:"absolute", left: "2rem", top: "1rem"}}
                src={isMedium ? mobileLogo : logo}
                alt="logo"
            />
        </RouterLink>
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${background})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'Info.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Connexion
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {isError && <Alert severity="error" >L'email et le mot de passe ne correspondent pas</Alert>}
                        {needsEmailVerification && <Alert severity="warning">Vous devez verifier votre email avant de pouvoir vous connecter</Alert>}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={isError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={isError}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Rester connecté"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link variant="body2">
                                    {"Mot de passe oublié ?"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component={RouterLink} to="/sign-up" state={{from: from}} variant="body2">
                                    {"Pas de compte ? S'inscrire"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
        </Box>
    );
}