import React, { useEffect, useState } from 'react';
import { useTheme, Box, Grid, Button, TextField, Card, CardHeader, CardContent, Typography, CircularProgress } from "@mui/material";
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { saveDevScheduleApi } from '../../axios/ApiProvider';
import { parsingDeviceData } from '../../axios/ParseProvider';
import dayjs from 'dayjs';

const weeks = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
export const ScheduleBoards = ({ isMobile, isPortrait, devData, socketIo }) => {
  const { t } = useTranslation();
  const devMetaData = useSelector(store => store.devMetaData);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scheduleList, setScheduleList] = useState([]);
  const [openStartTime, setOpenStartTime] = useState(null);
  const [openEndTime, setOpenEndTime] = useState(null);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isSavingWeek, setIsSavingWeek] = useState(null);
  useEffect(() => {
    console.log('metatDataEffect', devMetaData);
    // if (devMetaData.attributes.devSchedules) {
    //   // setScheduleList(devMetaData.attributes.devSchedules);
    // } else {
    //   let weekList = [];
    //   weeks.map(weekItem => {
    //     weekList.push({
    //       weekDay: weekItem,
    //       targetTemp: 0,
    //       times: [
    //         {
    //           start: null,
    //           end: null
    //         },
    //         {
    //           start: null,
    //           end: null
    //         },
    //         {
    //           start: null,
    //           end: null
    //         }
    //       ]
    //     })
    //   })
    //   setScheduleList(weekList);
    // }

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
    const dataSentTopic = `axinar/solbox/${devData.DeviceID}/jsonDataSent`
    socketIo.on(dataSentTopic, (message) => {
      const jsonData = JSON.parse(message);
      console.log('schedule Data', dataSentTopic, message, jsonData)
      parsingScheduleData(jsonData)
    })
  }, [devMetaData])

  const parsingScheduleData = (jsonData) => {
    console.log('parsingSchedule', jsonData);
    let tmpSchedules = []
    weeks.map(weekItem => {
      const tmpItem = {
        weekDay: weekItem,
        targetTemp: jsonData[`targetTemp${weekItem}`],
        times: [
          {
            start: parsingTime(jsonData[`timeStart${weekItem}`][0]),
            end: parsingTime(jsonData[`timeEnd${weekItem}`][0])
          },
          {
            start: parsingTime(jsonData[`timeStart${weekItem}`][1]),
            end: parsingTime(jsonData[`timeEnd${weekItem}`][1])
          },
          {
            start: parsingTime(jsonData[`timeStart${weekItem}`][2]),
            end: parsingTime(jsonData[`timeEnd${weekItem}`][2])
          }
        ]
      };
      tmpSchedules.push(tmpItem);
    });
    console.log(tmpSchedules);
    setScheduleList(tmpSchedules);
  }

  const parsingTime = (timeVal) => {
    let resultVal = null;
    if (timeVal === 999999 || timeVal === null) {
      resultVal = null;
    } else {
      resultVal = dayjs()
      const tmpStr = timeVal.toString().padStart(6, '0')
      const convertStr = `${tmpStr.substr(0, 2)}:${tmpStr.substr(2, 2)}:${tmpStr.substr(4, 2)}`;
      resultVal.hour(parseInt(tmpStr.substr(0, 2)));
      resultVal.minute(parseInt(tmpStr.substr(2, 2)));
      resultVal.second(parseInt(tmpStr.substr(4, 2)));
    }
    return resultVal;
  }

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
      setIsSavingAll(true)
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
      socketIo.emit('devDataSent', { devInfo }, (error) => {
        if (error) {
          alert(error);
        }
      })
      await callSaveDevScheduleApi();
      // const scheduleRes = await saveDevScheduleApi(scheduleLoad)
      // const tmpDevMetaData = parsingDeviceData(scheduleRes.data)
      // console.log(tmpDevMetaData);
    }
  }

  const callSaveDevScheduleApi = async () => {
    let devSchedulePayload = [];
    scheduleList.map(item => {
      let scheduleDayStr = '';
      scheduleDayStr += item.weekDay + '-';
      scheduleDayStr += item.targetTemp + '-';
      let startArr = [];
      let endArr = [];
      item.times.map(tItem => {
        startArr.push(tItem.start ? tItem.start.$d.getTime() : 0);
        endArr.push(tItem.end ? tItem.end.$d.getTime() : 0);
      });
      scheduleDayStr += startArr.join(':') + '-'
      scheduleDayStr += endArr.join(':');
      devSchedulePayload.push(scheduleDayStr)
    });
    console.log(devSchedulePayload);
    const scheduleLoad = {
      devId: devMetaData.id,
      schedulePayLoad: { devSchedules: devSchedulePayload }
    }
    const scheduleRes = await saveDevScheduleApi(scheduleLoad)
    const tmpDevMetaData = parsingDeviceData(scheduleRes.data)
    setIsSavingAll(false)
    setIsSavingWeek(null);
    window.toastr.success('Schedule Data is Saved');
    console.log(tmpDevMetaData);
  }

  const onSaveWeekDailySchedule = async (key) => {
    setIsSavingWeek(key);
    const weekDayData = scheduleList[key];
    let weekStartTime = [];
    let weekEndTime = [];
    weekDayData.times.map(tItem => {
      const startTimeStr = tItem.start ? parseInt(`${(tItem.start.$H).toString().padStart(2, '0')}${(tItem.start.$m).toString().padStart(2, '0')}${(tItem.start.$s).toString().padStart(2, '0')}`) : parseInt('999999');
      const endTimeStr = tItem.end ? parseInt(`${(tItem.end.$H).toString().padStart(2, '0')}${(tItem.end.$m).toString().padStart(2, '0')}${(tItem.end.$s).toString().padStart(2, '0')}`) : parseInt('999999')
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
    console.log('devInfo', devInfo);
    socketIo.emit('scheduleTopic', { devInfo }, (error) => {
      if (error) {
        alert(error);
      }
    })
    await callSaveDevScheduleApi();
  }

  const onChangeTargetTemp = (key, e) => {
    const tmpWeekList = scheduleList;
    tmpWeekList[key].targetTemp = e.target.value;
    setScheduleList(tmpWeekList);
  }

  return (
    <Box width={"100%"} paddingX={isPortrait ? 0 : 3} paddingY={3}>
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
                {/* <Button type='submit' variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>
                  {isSavingAll ? <CircularProgress size={20} /> : t('save_all')}
                </Button> */}
              </Stack>
            </Grid>
            {scheduleList.map((scheduleItem, key) => (<Grid item key={key} xs={12}>
              <Card color={colors.primary[100]} >
                <Grid container spacing={1} padding={1}>
                  <Grid item md={6} xs={6} order={{ xs: 1, md: 1 }} >
                    <Typography variant='h4'>{t(scheduleItem.weekDay)}</Typography>
                  </Grid>
                  <Grid item md={5} xs={12} textAlign={'right'} order={{ xs: 3, md: 2 }} >
                    <TextField label={t('target_temperature')} size='small'
                      value={scheduleItem?.targetTemp}
                      onChange={(e) => onChangeTargetTemp(key, e)}
                      InputLabelProps={{
                        shrink: true,
                      }} />
                  </Grid>
                  <Grid item md={1} xs={6} order={{ xs: 2, md: 3 }} >
                    <Button disabled={isSavingWeek === key} fullWidth onClick={() => onSaveWeekDailySchedule(key)} variant='contained' color='success' sx={{ fontWeight: 'bold' }}>
                      {isSavingWeek === key ? <CircularProgress size={20} /> : t('save')}
                    </Button>
                  </Grid>
                </Grid>

                <CardContent sx={{
                  padding: scheduleItem.times.length > 0 ? 1 : 0, '&:last-child': {
                    paddingBottom: '15px'
                  }
                }}>
                  <Grid container spacing={2} >
                    {scheduleItem.times.map((timeItem, timeKey) => (
                      <Grid key={timeKey} item md={4} xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        {/* <Stack direction={'flex'} spacing={1} justifyContent={'center'} alignItems={'center'}> */}
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
                        {/* </Stack> */}
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