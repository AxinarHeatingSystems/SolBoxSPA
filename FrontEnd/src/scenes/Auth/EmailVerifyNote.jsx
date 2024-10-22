import React from 'react';
import { Box } from "@mui/system"
import iotBg from '../../assets/Backgroound/iotBg.jpg'
import { Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const EmailVerifyNote = () => {
  const { t } = useTranslation();
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
              {t('register_was_successful')}
            </Typography>
            <Typography variant="h4" color="text.secondary" fontWeight={'bold'} textAlign={'center'}>
              {t('register_was_successful_msg')}

            </Typography>
          </CardContent>
        </Card>
      </Box>
    </main>
  )
}