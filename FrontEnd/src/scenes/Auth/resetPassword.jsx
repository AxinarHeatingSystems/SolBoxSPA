import React, { useState, useContext, useEffect } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginApi, resetPasswordApi } from '../../axios/ApiProvider';
import { isLoggedIn_Store, userData_Store } from '../../store/actions/mainAction';


export const ResetPassword = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const isMobileDetect = useSelector(store => store.isMobileDetect);
    const isPortrait = useSelector(store => store.isPortrait);
    console.log(theme, colors);
    const [email, setEmail] = useState();
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState();
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState();
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const onEmailChange = (e) => {
        setEmail(e.target.value);
        if (e.target.validity.valid) {
            setEmailError(false);
        } else {
            setEmailError(true);
        }
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.validity.valid) {
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    }

    const onConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.validity.valid || e.target.value != password) {
            setConfirmPasswordError(false);
        } else {
            setConfirmPasswordError(true);
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            const resLog = await resetPasswordApi({ email: email, newPassword: password });
            if (resLog.data.state == "success") {
                window.toast.success('Password is Updated');
                setTimeout(() => { window.location.href = '/login'; }, 1000)
            } else {
                window.toastr.error('Reset Password is failed');
            }
        } else {
            alert("Form is invalid! Please check the fields...");
        }
    }

    return (
        <main className="content" >
            <Box width={'100%'} height={'100vh'} display={'flex'}
                sx={{
                    backgroundImage: `url(${iotBg})`,
                    backgroundColor: '#010822',
                    backgroundOrigin: 'center',
                    backgroundSize: 'auto 100%',
                    backgroundRepeat: 'no-repeat'
                }}>
                <Box width={'50%'} display={isMobileDetect ? 'none' : 'block'}>

                </Box>
                <Box width={isMobileDetect ? '100%' : '50%'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                >
                    <Box padding={3}>
                        <Typography variant="h2" marginBottom={4}>Login - SolBox Control Panel</Typography>
                        <Grid component={'form'} onSubmit={handleLoginSubmit} marginBottom={2} container spacing={3}>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-email"
                                    label="Email" type='email' variant="outlined"
                                    value={email}
                                    error={emailError}
                                    onChange={onEmailChange}
                                    required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-password"
                                    value={password}
                                    error={passwordError}
                                    label="New Password" type='password' variant="outlined"
                                    onChange={onPasswordChange}
                                    required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-password"
                                    value={confirmPassword}
                                    error={confirmPasswordError}
                                    label="Confrim Password" type='password' variant="outlined"
                                    onChange={onConfirmPasswordChange}
                                    required />
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" color={'success'}
                                    type="submit"
                                    sx={{ fontWeight: 600 }}
                                >Reset Password</Button>
                            </Grid>
                        </Grid>
                        <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Link to="/register">
                                <Typography variant='body1' fontWeight={600}>
                                    Register Now!
                                </Typography>
                            </Link>
                            <Link to={'/login'} color={theme.palette.text}>
                                <Typography variant='body1' fontWeight={600} color={theme.palette.text}>
                                    Login Now!
                                </Typography>
                            </Link>

                        </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', top: '0', right: '0', padding: 1 }}>
                        <IconButton onClick={() => { colorMode.toggleColorMode(); }} sx={{ marginY: '10px' }} size={"small"} color={'#fff'}>
                            {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                        </IconButton >
                    </Box>
                </Box>
            </Box>
        </main >
    )
}