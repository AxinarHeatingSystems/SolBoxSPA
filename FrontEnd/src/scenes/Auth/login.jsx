import React, { useState, useContext, useEffect } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { useTheme, Button, TextField, Typography, IconButton, Grid } from "@mui/material"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";
import { Link } from 'react-router-dom';

export const Login = () => {
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
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box padding={3}>
            <Typography variant="h2" marginBottom={4}>Login - SolBox Control Panel</Typography>
            <Grid marginBottom={2} container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth id="outlined-email" label="Email" type='email' variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField error={true} fullWidth id="outlined-password" label="Password" type='password' variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color={'success'}
                  sx={{ fontWeight: 600 }}
                >Login</Button>
              </Grid>
            </Grid>
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