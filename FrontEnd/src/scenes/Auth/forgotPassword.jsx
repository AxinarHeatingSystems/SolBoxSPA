import React, { useState, useContext, useEffect } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
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
          padding={5}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box padding={3}>
            <Typography variant="h2" marginBottom={4}>Forgot Password?</Typography>
            <Grid marginBottom={2} container spacing={3}>
              <Grid item xs={12}>
                <Typography variant='h4'>
                  Enter your email and we'll send you instructions to reset your password
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="forgotPassword-input" label="Email" type="email" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color={'success'}
                  sx={{ fontWeight: 600 }}
                >Send Reset Link</Button>
              </Grid>
            </Grid>
            <Box width={'100%'}>
              <Link to="/login">
                <Typography variant='body1' fontWeight={600}>
                  Back to Login
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