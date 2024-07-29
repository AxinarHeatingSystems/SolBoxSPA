import React, { useEffect, useState } from 'react';
import { useTheme, Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Button, InputLabel, Select, MenuItem, TextField, Typography, Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import dayjs, { unix } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { saveDevScheduleApi } from '../../axios/ApiProvider';
import { devMetaData_store } from '../../store/actions/mainAction';
import { parsingDeviceData } from '../../axios/ParseProvider';
import AddIcon from '@mui/icons-material/Add';

const weeks = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
export const ScheduleBoards = ({ devData, socketIo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector(store => store.userData);
  const devMetaData = useSelector(store => store.devMetaData);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scheduleList, setScheduleList] = useState([]);
  useEffect(() => {
    console.log('metatDataEffect', devMetaData);
    let weekList = [];
    weeks.map(weekItem => {
      weekList.push({
        weekDay: weekItem,
        times: []
      })
    })
    setScheduleList(weekList);

  }, [devMetaData])


  const onScheduleSumit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {

    }

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid component={'form'} onSubmit={onScheduleSumit} container spacing={3}>
            <Grid item xs={12}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <CalendarMonthIcon fontSize="large" color='success' />
                <Button type='submit' variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>Save</Button>
              </Stack>
            </Grid>
            {scheduleList.map((scheduleItem, key) => (<Grid item key={key} xs={12}>
              <Card color={colors.primary[100]} >
                <CardHeader title={scheduleItem.weekDay}
                  action={
                    <IconButton aria-label="settings">
                      <AddIcon />
                    </IconButton>
                  }
                />
                <CardContent >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Stack direction={'flex'}>
                        <TimePicker />
                        <TimePicker />
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>))}
          </Grid>
        </LocalizationProvider>
      </Box>
    </Box>
  )
}