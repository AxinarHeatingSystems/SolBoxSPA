import React, { useEffect, useState } from 'react';
import { useTheme, Box, Button, Grid, TextField } from "@mui/material";
import LanIcon from '@mui/icons-material/Lan';
import { getAllUsers } from '../../axios/ApiProvider';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../theme';

export const ShareBoards = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const colors = tokens(theme.palette.mode);
  const [shareEmail, setShareEmail] = useState();
  const [shareEmailErr, setShareEmailErr] = useState(false); 


  useEffect(() => {
    loadAllUsers();
  }, [])
  const loadAllUsers = async () => {
    const allUsers = await getAllUsers();
    console.log('getAllUsers', allUsers);
  }

  const onShareEmailChange = (e) => {
    setShareEmail(e.target.value);
    console.log('valid', e.target.validity)
    if (e.target.validity.valid) {
      setShareEmailErr(false);
    } else {
      setShareEmailErr(true);
    }
  }

  const onShareSubmit = async (e) => {
    console.log('shareSubmit', e);
  }

  return (
    <Box width={"100%"} padding={3}>
      <Box
        width={'100%'}
        height={'auto'}
        position={'relative'}
        backgroundColor={colors.primary[400]}
        padding={4}
        zIndex={0}
      >
        <Grid component={'form'} onSubmit={onShareSubmit} container spacing={3}>
          <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <LanIcon fontSize="large" color='success' />

            <Button type='submit' variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>{'Share'}</Button>
          </Grid>
          <Grid item xs={12} >
            <TextField type="email" fullWidth id="outlined-basic" label={t('email')}
              variant="outlined" required onChange={onShareEmailChange} value={shareEmail}
              error={shareEmailErr}
            />
          </Grid>
        </Grid>
      </Box>

    </Box>
  )
}