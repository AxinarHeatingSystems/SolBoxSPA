import React, { useState, useContext } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resetPasswordEmail } from '../../axios/ApiProvider';
import { useTranslation } from 'react-i18next';
import { SetLang } from '../../components/Language/SetLang';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobileDetect = useSelector(store => store.isMobileDetect);
  console.log(theme, colors);
  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState();
  const onEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.validity.valid) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const emailSentRes = await resetPasswordEmail(email);
      console.log(emailSentRes);
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
          padding={5}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box padding={3}>
            <Typography variant="h2" marginBottom={4}>{t("forgot_password")}</Typography>
            <Grid component={'form'} onSubmit={handleForgotPasswordSubmit} marginBottom={2} container spacing={3}>
              <Grid item xs={12}>
                <Typography variant='h4'>
                  {t("forgetpassword_txt")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="forgotPassword-input"
                  value={email}
                  error={emailError}
                  label={t("email")} type="email" variant="outlined"
                  onChange={onEmailChange}
                  required />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" type='submit' color={'success'}
                  sx={{ fontWeight: 600 }}
                >{t("sen_reset_link")}</Button>
              </Grid>
            </Grid>
            <Box width={'100%'}>
              <Link to="/login" style={{ color: theme.palette.mode === "dark" ? colors.primary[100] : colors.primary[600] }}>
                <Typography variant='body1' fontWeight={600}>
                  {t("back_login")}
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