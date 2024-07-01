import React, { useState, useContext, useEffect } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';
import MuiPhoneNumber from 'material-ui-phone-number';

export const Register = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  console.log(theme, colors);
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
        <Box width={'50%'}>

        </Box>
        <Box width={'50%'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          padding={6}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box padding={3}>
            <Typography variant="h2" marginBottom={4}>Register - SolBox Control Panel</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth id="outlined-userName" label="User Name" variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth id="outlined-name" label="Name" variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth id="outlined-surName" label="SurName" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <MuiPhoneNumber
                  defaultCountry='gr'
                  regions={'europe'}
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="outlined-email" label="Email" type='email' variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="outlined-password" label="Password" type='password' variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color={'success'}
                  sx={{ fontWeight: 600 }}
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