import React, { useState } from 'react';
import { useTheme, Box, Grid, TextField, Typography, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';
import EastIcon from '@mui/icons-material/East';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

export const SettingBoards = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startDate, setStartDate] = useState();
  const [startDayOpen, setStartDayOpen] = useState(false);
  const [endDate, setEndDate] = useState();
  const [endDayOpen, setEndDayOpen] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const togglePicker = () => setOpenPicker(!openPicker);
  return (
    <>
      <Box width={"100%"} padding={3}>
        <Box
          width={'100%'}
          height={'auto'}
          position={'relative'}
          backgroundColor={colors.primary[400]}
          padding={4}
          zIndex={0}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <SettingsSuggestIcon fontSize="large" color='success' />
              <Button variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>Save</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField type="number" fullWidth id="outlined-basic" label={'Max water temperature allowed from solar power'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField type="number" fullWidth id="outlined-basic" label={'Max water temperature from alternative heat source'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField type="number" fullWidth id="outlined-basic" label={'Price per kW/h'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Vacation period start"
                    value={startDate}
                    maxDate={endDate}
                    open={startDayOpen}
                    onOpen={() => setStartDayOpen(true)}
                    onClose={() => setStartDayOpen(false)}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        onClick: () => setStartDayOpen(true)
                      }
                    }}
                  />
                  <Typography variant='body1'>
                    <EastIcon />
                  </Typography>
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Vacation period start"
                    value={endDate}
                    minDate={startDate}
                    open={endDayOpen}
                    onOpen={() => setEndDayOpen(true)}
                    onClose={() => setEndDayOpen(false)}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      textField: {
                        onClick: () => setEndDayOpen(true)
                      }
                    }}
                  />
                </Stack>


              </LocalizationProvider>
            </Grid>
          </Grid>

        </Box>

      </Box>
    </>
  )
}