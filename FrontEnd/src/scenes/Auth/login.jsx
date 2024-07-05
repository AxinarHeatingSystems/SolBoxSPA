import React, { useState, useContext } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { googleAuthApi, loginApi, GoogleClientID } from '../../axios/ApiProvider';
import { isLoggedIn_Store, userData_Store } from '../../store/actions/mainAction';
import { GoogleLogin } from 'react-google-login';
console.log(GoogleClientID);
export const Login = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobileDetect = useSelector(store => store.isMobileDetect);
  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState();
  const [passwordError, setPasswordError] = useState(false);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const resLog = await loginApi({ email: email, password: password });
      console.log('email Logged In', resLog);
      if (resLog.data.state === "success") {
        let tmpUser = resLog.data.data;
        tmpUser.tokens = resLog.data.token;
        localStorage.setItem('userData', JSON.stringify(tmpUser));
        dispatch(userData_Store(tmpUser));
        dispatch(isLoggedIn_Store(true));
        setTimeout(() => { window.location.href = '/'; }, 500)
      }
      // alert("Form is valid! Submitting the form...");
    } else {
      alert("Form is invalid! Please check the fields...");
    }
  }
  const responseGoogle = async (response) => {
    console.log(response);
    if (response.profileObj) {
      const profileData = response.profileObj;
      const googleRes = await googleAuthApi(profileData);
      if (googleRes.state === 'success') {
        let tmpUser = googleRes.data.data;
        tmpUser.tokens = googleRes.data.token;
        localStorage.setItem('userData', JSON.stringify(tmpUser));
        dispatch(userData_Store(tmpUser));
        dispatch(isLoggedIn_Store(true));
        setTimeout(() => { window.location.href = '/'; }, 500)
      }
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
                  label="Password" type='password' variant="outlined"
                  onChange={onPasswordChange}
                  required />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color={'success'}
                  type="submit" 
                  sx={{ fontWeight: 600 }}
                >Login</Button>
              </Grid>
            </Grid>
            <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} marginBottom={1}>
              <GoogleLogin
                clientId={GoogleClientID}
                buttonText="Login with Google"
                className='googleSign-Button'
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </Box>
            <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Link to="/register">
                <Typography variant='body1' fontWeight={600}>
                  Register Now!
                </Typography>
              </Link>
              <Link to={'/forgotPassword'} color={theme.palette.text}>
                <Typography variant='body1' fontWeight={600} color={theme.palette.text}>
                  Forgot your Password?
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