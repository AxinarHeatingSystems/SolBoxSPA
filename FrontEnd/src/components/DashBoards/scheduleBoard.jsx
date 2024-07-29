import React, { useEffect, useState } from 'react';
import { useTheme, Box, Grid, Button, TextField, Card, CardHeader, CardContent } from "@mui/material";
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const weeks = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
export const ScheduleBoards = ({ devData, socketIo }) => {
  const { t } = useTranslation();
  const devMetaData = useSelector(store => store.devMetaData);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scheduleList, setScheduleList] = useState([]);
  const [openStartTime, setOpenStartTime] = useState(null);
  const [openEndTime, setOpenEndTime] = useState(null);
  useEffect(() => {
    console.log('metatDataEffect', devMetaData);
    let weekList = [];
    weeks.map(weekItem => {
      weekList.push({
        weekDay: weekItem,
        targetTemp: null,
        times: [
          {
            start: null,
            end: null
          },
          {
            start: null,
            end: null
          },
          {
            start: null,
            end: null
          }
        ]
      })
    })
    setScheduleList(weekList);
    const devInfo = {
      DeviceID: devData.DeviceID,
      payload: {
        sendWeekSchedule: 1,
      }
    }

    socketIo.emit('devUpdate', { devInfo }, (error) => {
      if (error) {
        alert(error);
      }
    })

  }, [devMetaData])

  // const addTimeToWeekDay = (key) => {
  //   let tmpWeekList = scheduleList;
  //   tmpWeekList[key].times.push({
  //     start: null,
  //     end: null
  //   });
  //   setScheduleList(tmpWeekList);
  // }

  const setWeekDayStartTime = (key, timekey, newValue) => {
    let tmpWeekList = scheduleList;
    tmpWeekList[key].times[timekey].start = newValue;
    setScheduleList(tmpWeekList);
  }

  const setWeekDayEndTime = (key, timekey, newValue) => {
    let tmpWeekList = scheduleList;
    tmpWeekList[key].times[timekey].end = newValue;
    setScheduleList(tmpWeekList);
  }

  const checkOpenStartTime = (weekKey, timeKey) => {
    const compareStr = `${weekKey}TO${timeKey}`;
    return compareStr === openStartTime;
  }

  const checkOpenEndTime = (weekKey, timeKey) => {
    const compareStr = `${weekKey}TO${timeKey}`;
    return compareStr === openEndTime;
  }
  const onScheduleSumit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      let schedulePayLoad = {};
      scheduleList.map(item => {
        let weekStartTime = [];
        let weekEndTime = [];
        item.times.map(tItem => {
          const startTimeStr = tItem.start ? `${(tItem.start.$H).toString().padStart(2, '0')}${(tItem.start.$m).toString().padStart(2, '0')}${(tItem.start.$s).toString().padStart(2, '0')}` : '999999';
          const endTimeStr = tItem.end ? `${(tItem.end.$H).toString().padStart(2, '0')}${(tItem.end.$m).toString().padStart(2, '0')}${(tItem.end.$s).toString().padStart(2, '0')}` : '999999'
          weekStartTime.push(startTimeStr);
          weekEndTime.push(endTimeStr);
        });
        schedulePayLoad = { ...schedulePayLoad, [`timeStart${item.weekDay}`]: weekStartTime }
        schedulePayLoad = { ...schedulePayLoad, [`timeEnd${item.weekDay}`]: weekEndTime }
      })
      console.log('loading Data', schedulePayLoad);
      const devInfo = {
        DeviceID: devData.DeviceID,
        payload: schedulePayLoad
      }
      console.log('totaly log', devInfo);
    }
  }

  const onSaveWeekDailySchedule = async (key) => {
    const weekDayData = scheduleList[key];
    let weekStartTime = [];
    let weekEndTime = [];
    weekDayData.times.map(tItem => {
      const startTimeStr = tItem.start ? `${(tItem.start.$H).toString().padStart(2, '0')}${(tItem.start.$m).toString().padStart(2, '0')}${(tItem.start.$s).toString().padStart(2, '0')}` : '999999';
      const endTimeStr = tItem.end ? `${(tItem.end.$H).toString().padStart(2, '0')}${(tItem.end.$m).toString().padStart(2, '0')}${(tItem.end.$s).toString().padStart(2, '0')}` : '999999'
      weekStartTime.push(startTimeStr);
      weekEndTime.push(endTimeStr);
    })
    const devInfo = {
      DeviceID: devData.DeviceID,
      payload: {
        weekday: weekDayData.weekDay,
        timeStart: weekStartTime,
        timeEnd: weekEndTime,
        targetTemp: weekDayData.targetTemp
      }
    }
    console.log(devInfo);
  }

  const onChangeTargetTemp = (key, e) => {
    const tmpWeekList = scheduleList;
    tmpWeekList[key].targetTemp = e.target.value;
    setScheduleList(tmpWeekList);
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
                <Button type='submit' variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>{t('save_all')}</Button>
              </Stack>
            </Grid>
            {scheduleList.map((scheduleItem, key) => (<Grid item key={key} xs={12}>
              <Card color={colors.primary[100]} >
                <CardHeader title={scheduleItem.weekDay}
                  action={

                    <Stack direction={'row'} spacing={1}>
                      <TextField label="Max Template" size='small'
                        value={scheduleItem.targetTemp}
                        onChange={(e) => onChangeTargetTemp(key, e)}
                        InputLabelProps={{
                          shrink: true,
                        }} />
                      <Button onClick={() => onSaveWeekDailySchedule(key)} variant='contained' size='small' color='success' sx={{ fontWeight: 'bold' }}>{t('save')}</Button>
                    </Stack>
                    // <IconButton aria-label="settings" onClick={() => addTimeToWeekDay(key)}>
                    //   <AddIcon />
                    // </IconButton>
                  }
                />
                <CardContent sx={{
                  padding: scheduleItem.times.length > 0 ? 1 : 0, '&:last-child': {
                    paddingBottom: '15px'
                  }
                }}>
                  <Grid container spacing={2} >
                    {scheduleItem.times.map((timeItem, timeKey) => (
                      <Grid key={timeKey} item xs={4}>
                        <Stack direction={'flex'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                          <TimePicker
                            label={t('start')}
                            open={checkOpenStartTime(key, timeKey)}
                            value={timeItem.start}
                            maxTime={timeItem.end}
                            onOpen={() => setOpenStartTime(`${key}TO${timeKey}`)}
                            onClose={() => setOpenStartTime(null)}
                            onChange={(newValue) => setWeekDayStartTime(key, timeKey, newValue)}
                            slotProps={{
                              textField: {
                                InputLabelProps: { shrink: true },
                                size: 'small',
                                onClick: () => { setOpenStartTime(`${key}TO${timeKey}`); }
                              }
                            }}
                          />
                          -
                          <TimePicker
                            label={t('end')}
                            open={checkOpenEndTime(key, timeKey)}
                            value={timeItem.end}
                            minTime={timeItem.start}
                            onOpen={() => setOpenEndTime(`${key}TO${timeKey}`)}
                            onClose={() => setOpenEndTime(null)}
                            onChange={(newValue) => setWeekDayEndTime(key, timeKey, newValue)}
                            slotProps={{
                              textField: {
                                InputLabelProps: { shrink: true },
                                size: 'small',
                                onClick: () => { setOpenEndTime(`${key}TO${timeKey}`); }
                              }
                            }}
                          />
                        </Stack>
                      </Grid>
                    ))}
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