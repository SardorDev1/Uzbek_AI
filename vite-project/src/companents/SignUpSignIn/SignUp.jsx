import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dashboard, ExitToApp } from '@mui/icons-material';
import { useState, useeffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
// TODO remove, this demo shouldn't need to reset the theme.
import { auth } from '../config/firebase';


const defaultTheme = createTheme();


export default function SignUp() {
    const [name, setName] = useState(null)
    const [fullname, setFullname] = useState(null)
    const [error, sertError] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()

    const SignUpHandler = async (e) => {
        e.preventDefault();


        if (name === null || fullname === null || email === null || password === null) {
            sertError("qolib ketgan bo'shliqlarni to'ldirishingiz kerak!");

        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Signed in 
                localStorage.setItem('fullname', fullname)
                localStorage.setItem('name', name)

                navigate('/')
                // ...
            } catch (error) {
                if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                    sertError("hisob allaqachon ro'yhatdan o'tgan");
                } else if (error.message === 'Firebase: Error (auth/invalid-email).') {
                    sertError("noto'g'ri email");
                } else if (error.message === 'auth/weak-password Firebase: Password should be at least 6 characters (auth/weak-password).') {
                    sertError("parol kamida 6ta so'z , raqam yoki simvoldan iborat bo'lishi kerak");

                } else {
                    sertError("hisobda kirishda xatolik bo'ldi");

                }

            }
        }
    };









    return (
        <div className='SignUp' style={{ margin: "0px 5px 0px 5px" }} >
            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://source.unsplash.com/random?,wallpapers)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
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
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <ExitToApp />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Ro'yhatdan O'tish
                            </Typography>
                            <Box component="form" noValidate onSubmit={SignUpHandler} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    id="surename"
                                    label="ismingiz"
                                    name="surename"
                                    autoComplete="text"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    onChange={(e) => setFullname(e.target.value)}
                                    id="fullname"
                                    label="Familiyangiz"
                                    name="fullname"
                                    autoComplete="textD"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}

                                    label="Emailngiz"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="parol"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}

                                    id="password"
                                    autoComplete="current-password"
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Ro'yhatdan O'tish
                                </Button>
                                <p style={{ textAlign: "center", color: "red", marginTop: "10px", marginBottom: "10px" }}>{error === null ? '' : error}</p>
                                <Grid container>

                                    <Grid item>
                                        <Link to={'/login'} variant="body2" sx={{ cursor: 'pointer' }}>
                                            {"Accountingiz bormi?"}
                                        </Link>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
}