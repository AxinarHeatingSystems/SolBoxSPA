import React, { useState, useContext } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resetPasswordApi } from '../../axios/ApiProvider';
import { SetLang } from '../../components/Language/SetLang';
import { useTranslation } from 'react-i18next';

export const ResetPassword = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const isMobileDetect = useSelector(store => store.isMobileDetect);
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
        if (e.target.validity.valid && e.target.value === password) {
            setConfirmPasswordError(false);
        } else {
            setConfirmPasswordError(true);
        }
    }

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (e.target.checkValidity() && !confirmPasswordError) {
            const resLog = await resetPasswordApi({ email: email, newPassword: password });
            console.log(resLog);
            if (resLog.state === "success") {
                setTimeout(() => { window.location.href = '/login'; }, 1000)
            } 
        } else {
            window.toastr.error("Form is invalid! Please check the fields...");
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
                        <Typography variant="h2" marginBottom={4}>{t("resetpassword")} -{t("title")} </Typography>
                        <Grid component={'form'} onSubmit={handleResetPasswordSubmit} marginBottom={2} container spacing={3}>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-email"
                                    label={t("email")} type='email' variant="outlined"
                                    value={email}
                                    error={emailError}
                                    onChange={onEmailChange}
                                    required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-password"
                                    value={password}
                                    error={passwordError}
                                    label={t("new_password")} type='password' variant="outlined"
                                    onChange={onPasswordChange}
                                    required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-password"
                                    value={confirmPassword}
                                    error={confirmPasswordError}
                                    label={t("confirm_password")} type='password' variant="outlined"
                                    onChange={onConfirmPasswordChange}
                                    required />
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" color={'success'}
                                    type="submit"
                                    sx={{ fontWeight: 600 }}
                                >{t("resetpassword")}</Button>
                            </Grid>
                        </Grid>
                        <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Link to="/register">
                                <Typography variant='body1' fontWeight={600} style={{ color: theme.palette.mode === "dark" ? colors.primary[100] : colors.primary[600] }}>
                                    {t("register_now")}
                                </Typography>
                            </Link>
                            <Link to={'/login'} color={theme.palette.text} style={{ color: theme.palette.mode === "dark" ? colors.primary[100] : colors.primary[600] }}>
                                <Typography variant='body1' fontWeight={600} color={theme.palette.text}>
                                    {t("login_now")}
                                </Typography>
                            </Link>

                        </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', top: '0', right: '0', padding: 1, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                        <SetLang />
                        <IconButton onClick={() => { colorMode.toggleColorMode(); }} sx={{ marginY: '10px' }} size={"small"} color={'#fff'}>
                            {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                        </IconButton >
                    </Box>
                </Box>
            </Box>
        </main >
    )
}