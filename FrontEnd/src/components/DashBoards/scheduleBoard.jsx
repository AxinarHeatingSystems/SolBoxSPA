import React, { useState } from 'react';
import { useTheme, Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Button, InputLabel, Select, MenuItem, TextField, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const weeks = new Array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
export const ScheduleBoards = () => {
  const { t } = useTranslation();
  const userData = useSelector(store => store.userData);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scheduleOption, setScheduleOption] = useState('daily');
  const [weeklyOption, setWeeklyOption] = useState("0");
  const [weekStartArr, setWeekStartArr] = useState(weeks);
  const [weeklyData, setWeeklyData] = useState({
    weekDay: null,
    startTime: null,
    endTime: null
  })
  const [weeklyStartTimeOpen, setWeeklyStartTimeOpen] = useState(false);
  const [weeklyEndTimeOpen, setWeeklyEndTimeOpen] = useState(false);

  const [dayPickerOpen, setDayPickerOpen] = useState();
  const [startTimeOpen, setStartTimeOpen] = useState();
  const [endTimeOpen, setEndTimeOpen] = useState();
  const [dailyList, setDailyList] = useState([{
    date: null,
    startTime: null,
    endTime: null
  }]);

  const addNewDailySchedule = () => {
    var tmpDailyList = dailyList;
    tmpDailyList.push({
      date: null,
      startTime: '',
      endTime: ''
    })
    setDailyList(tmpDailyList);
  }

  const removeDailySchedule = (checkkey) => {
    let tmpDailyList = [];
    if (dailyList.length > 1) {
      dailyList.map((dailyItem, key) => {
        if (key !== checkkey) {
          tmpDailyList.push(dailyItem);
        }
      })
      setDailyList(tmpDailyList);
    }
  }

  const handleWeeklyChange = (e) => {
    setWeeklyOption(e.target.value);
  }

  const handleScheduleChange = (e) => {
    console.log(e);
    setScheduleOption(e.target.value);
  }

  const handleChangeWeekStartDay = (e) => {
    const tmpWeekDay = weeklyData;
    tmpWeekDay.weekDay = e.target.value;
    setWeeklyData(tmpWeekDay);
    // setWeekStartDay(e.target.value);
    // const indexer = weeks.indexOf(e.target.value);
    // const slicedData = weeks.slice((indexer + 1));
    // console.log('clidedData', slicedData);
    // setWeekEndArr(slicedData);
  }

  const handleChangeWeekStartTime = (e) => {
    // console.log(dayjs(e));
    // const startTimeStr = `${(e.$H).toString().padStart(2, '0')}${(e.$m).toString().padStart(2, '0')}${(e.$s).toString().padStart(2, '0')}`
    const tmpWeekDay = weeklyData;
    tmpWeekDay.startTime = e
    setWeeklyData(tmpWeekDay);

  }
  const handleChangeWeekEndTime = (e) => {
    const tmpWeekDay = weeklyData;
    tmpWeekDay.endTime = e;
    setWeeklyData(tmpWeekDay);
  }

  const onChangeDailyVal = (dateVal, index) => {
    var tmpDailyList = dailyList;
    tmpDailyList[index].date = dateVal;
    setDailyList(tmpDailyList);
  }
  const onScheduleSumit = (e) => {
    e.preventDefault();
    console.log('FOrm Submit');
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
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">{t('scheule_option')}</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={scheduleOption}
                    onChange={handleScheduleChange}
                    name="weekly-option"
                  >
                    <FormControlLabel value="daily" control={<Radio />} label={t('daily')} />
                    <FormControlLabel value="weekdays" control={<Radio />} label={`${t('weekdays')}/${t('weekend')}`} />
                    <FormControlLabel value="fullweek" control={<Radio />} label={t('entire_week')} />
                  </RadioGroup>
                </FormControl>
                <Button type='submit' variant='contained' color='success'>Save</Button>
              </Stack>
            </Grid>
            {scheduleOption === "daily" &&
              <Grid item xs={12}>
                <Stack direction={'row'} paddingBottom={2} spacing={1} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography variant='body1'>{t('add_new_daily_schedule')}</Typography>
                  <Button variant='contained' color='success' onClick={() => { addNewDailySchedule() }}>{t('add')}</Button>
                </Stack>

                {dailyList.map((dayItem, key) => (
                  <Stack marginBottom={1} key={key} direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label={`${t("daily")} ${(key + 1)}`}
                      value={dayItem.date}
                      open={dayPickerOpen === key}
                      onOpen={() => setDayPickerOpen(key)}
                      onClose={() => setDayPickerOpen(null)}
                      onChange={(newValue) => onChangeDailyVal(newValue, key)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onClick: () => { setDayPickerOpen(key); }
                        }
                      }}

                    />
                    <TimePicker
                      label={t('start')}
                      open={startTimeOpen === key}
                      onOpen={() => setStartTimeOpen(key)}
                      onClose={() => setStartTimeOpen(null)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onClick: () => { setStartTimeOpen(key); }
                        }
                      }}
                    />
                    <TimePicker
                      label={t('end')}
                      open={endTimeOpen === key}
                      onOpen={() => setEndTimeOpen(key)}
                      onClose={() => setEndTimeOpen(null)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onClick: () => { setEndTimeOpen(key); }
                        }
                      }}
                    />
                    <Button variant='contained' onClick={() => { removeDailySchedule(key) }}>Remove</Button>
                  </Stack>
                ))}

              </Grid>
            }
            {scheduleOption === "weekdays" &&
              <Grid item xs={12}>
                <Box>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">{t('weekly_option')}</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={weeklyOption}
                      onChange={handleWeeklyChange}
                      name="week-option"
                    >
                      <FormControlLabel value="0" control={<Radio />} label={t('weekdays')} />
                      <FormControlLabel value="1" control={<Radio />} label={t('weekend')} />
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box >
                  {weeklyOption === "0" &&
                    <Stack direction={'row'} spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" size='small'>Start</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={weeklyData.weekDay}
                          label="Age"
                          size='small'
                          onChange={handleChangeWeekStartDay}
                        >
                          {weekStartArr.map((weekData, key) => (
                            <MenuItem value={weekData} key={key}>{weekData}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TimePicker
                        label={t('start')}
                        value={weeklyData.startTime}
                        onChange={handleChangeWeekStartTime}
                        open={weeklyStartTimeOpen}
                        onOpen={() => setWeeklyStartTimeOpen(true)}
                        onClose={() => setWeeklyStartTimeOpen(false)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            onClick: () => { setWeeklyStartTimeOpen(true); }
                          }
                        }}
                      />
                      <TimePicker
                        label={t('end')}
                        value={weeklyData.endTime}
                        onChange={handleChangeWeekEndTime}
                        open={weeklyEndTimeOpen}
                        onOpen={() => setWeeklyEndTimeOpen(true)}
                        onClose={() => setWeeklyEndTimeOpen(false)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            onClick: () => { setWeeklyEndTimeOpen(true); }
                          }
                        }}
                      />
                    </Stack>
                  }
                  {weeklyOption === "1" &&
                    <Stack direction={'row'} spacing={2}>
                      <TextField label="Start" fullWidth variant='outlined' value={'Saturday'} disabled />
                      <TextField label="End" fullWidth variant='outlined' value={'Sunday'} disabled />
                    </Stack>
                  }
                </Box>
              </Grid>
            }
            {scheduleOption === "fullweek" &&
              <Grid item xs={12}>
                <Button variant='contained'>ECO mode</Button>
              </Grid>
            }
          </Grid>
        </LocalizationProvider>
      </Box>
    </Box>
  )
}