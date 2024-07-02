import React, { useState, useContext, useEffect } from 'react';
import { Box, display } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
import MuiPhoneNumber from 'material-ui-phone-number';
import { useSelector } from 'react-redux';
import { registerApi } from '../../axios/ApiProvider';

export const Register = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobileDetect = useSelector(store => store.isMobileDetect);
  const isPortrait = useSelector(store => store.isPortrait);
  console.log(theme, colors);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [surName, setSurName] = useState('');
  const [surNameError, setSurNameError] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
    if (e.target.validity.valid) {
      setUserNameError(false);
    } else {
      setUserNameError(true);
    }
  }
  const onNameChange = (e) => {
    setName(e.target.value);
    if (e.target.validity.valid) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  }
  const onSurNameChange = (e) => {
    setSurName(e.target.value);
    if (e.target.validity.valid) {
      setSurNameError(false);
    } else {
      setSurNameError(true);
    }
  }
  const onPhoneChange = (e) => {
    console.log(e);
    setPhone(e);
    // if (e.target.validity.valid) {
    //   setPhoneError(false);
    // } else {
    //   setPhoneError(true);
    // }
  }
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

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const userData = {
        name: name,
        userName: userName,
        surName: surName,
        phone: phone,
        email: email,
        password: password
      }
      await registerApi(userData);
      // const resLog = await loginApi({ email: email, password: password });
      // console.log('email Logged In', resLog);
      // alert("Form is valid! Submitting the form...");
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
          padding={6}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box padding={3}>
            <Typography variant="h2" marginBottom={4}>Register - SolBox Control Panel</Typography>
            <Grid component={'form'} onSubmit={onRegisterSubmit} container spacing={3}>
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <TextField fullWidth id="outlined-userName"
                  value={userName}
                  error={userNameError}
                  label="User Name" variant="outlined" size='small'
                  onChange={onUserNameChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth id="outlined-name"
                  value={name}
                  error={nameError}
                  label="Name" variant="outlined" size='small'
                  onChange={onNameChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth id="outlined-surName"
                  value={surName}
                  error={surNameError}
                  label="SurName" variant="outlined" size='small'
                  onChange={onSurNameChange}
                  required
                />
              </Grid>
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <MuiPhoneNumber
                  defaultCountry='gr'
                  regions={'europe'}
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                  size='small'
                  value={phone}
                  error={phoneError}
                  onChange={onPhoneChange}
                  required
                />
              </Grid>
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <TextField fullWidth id="outlined-email"
                  value={email}
                  error={emailError}
                  label="Email" type='email' variant="outlined" size='small'
                  onChange={onEmailChange}
                  required
                />
              </Grid>
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <TextField fullWidth id="outlined-password"
                  value={password}
                  error={passwordError}
                  label="Password" type='password' variant="outlined" size='small'
                  onChange={onPasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color={'success'}
                  sx={{ fontWeight: 600 }} type='submit'
                >Register</Button>
              </Grid>
            </Grid>
            <Box marginTop={1} width={'100%'} textAlign={'right'}>
              <Link to="/login">
                <Typography variant='body1' fontWeight={600}>
                  Back to Login !
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