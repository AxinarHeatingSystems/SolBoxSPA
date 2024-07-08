import React, { useState, useContext } from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { Card, CardContent, Typography } from '@mui/material';

export const EmailVerifyNote = () => {
  return (
    <main className="content">
      <Box width={'100%'} height={'100vh'} display={'flex'}
        justifyContent={'center'} alignItems={'center'}
        sx={{
          backgroundImage: `url(${iotBg})`,
          backgroundColor: '#010822',
          backgroundOrigin: 'center',
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'no-repeat'
        }}>
        <Card sx={{ padding: '1rem', width: 'fit-content', height: 'fit-content' }}>
          <CardContent>
            <Typography textAlign={'center'} gutterBottom variant="h1" component="div">
              Register was successful
            </Typography>
            <Typography variant="h4" color="text.secondary" fontWeight={'bold'} textAlign={'center'}>
              The user is created. An email has been sent to your email address.<br /> Please verify your email.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </main>
  )
}