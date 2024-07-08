import React, { useState, useContext } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
// import MuiPhoneNumber from 'material-ui-phone-number';
import { useSelector } from 'react-redux';
import { GoogleClientID, googleSignUpApi, registerApi } from '../../axios/ApiProvider';
import { GoogleLogin } from 'react-google-login';
import { useTranslation } from 'react-i18next';
import { SetLang } from '../../components/Language/SetLang';

export const Register = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobileDetect = useSelector(store => store.isMobileDetect);
  const isPortrait = useSelector(store => store.isPortrait);
  const [firstname, setFirstName] = useState('');
  const [firstNmeError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [userType, setUserType] = useState();
  // const [userTypeError, setUserTypeError] = useState(false);
  // const [phone, setPhone] = useState('');
  // const [phoneError, setPhoneError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  // const [userCreated, setUserCreated] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
    if (e.target.validity.valid) {
      setUserNameError(false);
    } else {
      setUserNameError(true);
    }
  }
  const onfirstNameChange = (e) => {
    setFirstName(e.target.value);
    if (e.target.validity.valid) {
      setFirstNameError(false);
    } else {
      setFirstNameError(true);
    }
  }
  const onlastNameChange = (e) => {
    setLastName(e.target.value);
    if (e.target.validity.valid) {
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
  }
  // const onPhoneChange = (e) => {
  //   console.log(e);
  //   setPhone(e);

  // }
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

  const onUserTypeChange = (e) => {
    // console.log(e);
    setUserType(e.target.value);
  }

  const onRegisterSubmit = async (e) => {
    setIsSignUp(true);
    e.preventDefault();
    if (e.target.checkValidity()) {
      const userData = {
        username: userName,
        firstname: firstname,
        lastname: lastName,
        // phone: phone,
        usertype: userType,
        email: email,
        password: password
      }

      const registerRes = await registerApi(userData);

      if (registerRes.state === 'success') {
        // setUserCreated(true);
        setTimeout(() => { window.location.href = '/registerationsuccess'; }, 500)
      } else {
        setIsSignUp(false);
      }
    } else {
      alert("Form is invalid! Please check the fields...");
      setIsSignUp(false);
    }
  }
  const responseGoogle = async (response) => {
    setIsSignUp(true);
    console.log(response);
    if (response.profileObj) {
      const profileData = response.profileObj;
      const googleRes = await googleSignUpApi(profileData);
      if (googleRes.state === 'success') {
        // setUserCreated(true);
        setTimeout(() => { window.location.href = '/registerationsuccess'; }, 500)
        // let tmpUser = googleRes.data.data;
        // tmpUser.tokens = googleRes.data.token;
        // localStorage.setItem('userData', JSON.stringify(tmpUser));
        // dispatch(userData_Store(tmpUser));
        // dispatch(isLoggedIn_Store(true));
        // setTimeout(() => { window.location.href = '/'; }, 500)
      } else {
        setIsSignUp(false);
      }
    } else {
      setIsSignUp(false);
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
            <Typography variant="h2" marginBottom={4}>{t("register")} - {t("title")}</Typography>
            <Grid component={'form'} onSubmit={onRegisterSubmit} container spacing={3}>
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <TextField fullWidth id="outlined-userName"
                  value={userName}
                  error={userNameError}
                  label={t("user_name")} variant="outlined" size='small'
                  onChange={onUserNameChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth id="outlined-name"
                  value={firstname}
                  error={firstNmeError}
                  label={t("first_name")} variant="outlined" size='small'
                  onChange={onfirstNameChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth id="outlined-lastName"
                  value={lastName}
                  error={lastNameError}
                  label={t("last_name")} variant="outlined" size='small'
                  onChange={onlastNameChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-helper-label">User Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="User Type"
                    value={userType}
                    onChange={onUserTypeChange}
                  >
                    <MenuItem value={'user'}>User</MenuItem>
                    <MenuItem value={'technician'}>Technician</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <MuiPhoneNumber
                  defaultCountry='gr'
                  regions={'europe'}
                  fullWidth
                  variant="outlined"
                  label={t("phone_number")}
                  size='small'
                  value={phone}
                  error={phoneError}
                  onChange={onPhoneChange}
                  required
                />
              </Grid> */}
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <TextField fullWidth id="outlined-email"
                  value={email}
                  error={emailError}
                  label={t("email")} type='email' variant="outlined" size='small'
                  onChange={onEmailChange}
                  required
                />
              </Grid>
              <Grid item xs={isMobileDetect ? isPortrait ? 12 : 6 : 12}>
                <TextField fullWidth id="outlined-password"
                  value={password}
                  error={passwordError}
                  label={t("Password")} type='password' variant="outlined" size='small'
                  onChange={onPasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color={'success'}
                  sx={{ fontWeight: 600 }} type='submit' disabled={isSignUp}
                >{t("register")}</Button>
              </Grid>
            </Grid>
            <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={1}>
              <GoogleLogin
                clientId={GoogleClientID}
                buttonText={t("regist_with_google")}
                className='googleSign-Button'
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                disabled={isSignUp}
                cookiePolicy={'single_host_origin'}
              />
            </Box>
            <Box marginTop={1} width={'100%'} textAlign={'right'} >
              <Link to="/login" style={{ color: theme.palette.mode === "dark" ? colors.primary[100] : colors.primary[600] }}>
                <Typography variant='body1' fontWeight={600} >
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