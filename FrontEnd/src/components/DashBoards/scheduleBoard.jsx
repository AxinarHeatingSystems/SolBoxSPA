import React, { useEffect, useState } from 'react';
import { useTheme, Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Button, InputLabel, Select, MenuItem, TextField, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';

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
  const [weeklyOption, setWeeklyOption] = useState(0);
  const [weekStartArr, setWeekStartArr] = useState(weeks);
  const [weekStartDay, setWeekStartDay] = useState();
  const [weekEndArr, setWeekEndArr] = useState(weeks);
  const [weekEndDay, setWeekEndDay] = useState();

  const [dayPickerOpen, setDayPickerOpen] = useState();
  const [startTimeOpen, setStartTimeOpen] = useState();
  const [endTimeOpen, setEndTimeOpen] = useState();
  const [dailyList, setDailyList] = useState([{
    date: null,
    startTime: '',
    endTime: ''
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
    setWeekStartDay(e.target.value);
    const indexer = weeks.indexOf(e.target.value);
    const slicedData = weeks.slice((indexer + 1));
    console.log('clidedData', slicedData);
    setWeekEndArr(slicedData);
  }

  const handleChangeWeekEndDay = (e) => {
    setWeekEndDay(e.target.value);
    const indexer = weeks.indexOf(e.target.value);
    const slicedData = weeks.slice(0, indexer);
    setWeekStartArr(slicedData);
  }

  const onChangeDailyVal = (dateVal, index) => {
    var tmpDailyList = dailyList;
    tmpDailyList[index].date = dateVal;
    setDailyList(tmpDailyList);
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
          </Grid>
          {scheduleOption === "daily" &&
            <Grid item xs={12}>
              <Stack direction={'row'} paddingBottom={2} spacing={1} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant='body1'>Add New Daily Schedule</Typography>
                <Button variant='contained' color='success' onClick={() => { addNewDailySchedule() }}>Add</Button>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {dailyList.map((dayItem, key) => (
                  <Stack marginBottom={1} key={key} direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label={`${t("daily")} 1`}
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
                      label="Start"
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
                      label="End"
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

              </LocalizationProvider>
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
                      <InputLabel id="demo-simple-select-label">Start</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={weekStartDay}
                        label="Age"
                        onChange={handleChangeWeekStartDay}
                      >
                        {weekStartArr.map((weekData, key) => (
                          <MenuItem value={weekData} key={key}>{weekData}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">End</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={weekEndDay}
                        label="Age"
                        onChange={handleChangeWeekEndDay}
                      >
                        {weekEndArr.map((weekData, key) => <MenuItem value={weekData} key={key}>{weekData}</MenuItem>)}
                      </Select>
                    </FormControl>
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
      </Box>
    </Box>
  )
}