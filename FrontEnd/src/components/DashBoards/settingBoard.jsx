import React, { useEffect, useState } from 'react';
// import {
//   getAllCountriesName,
//   getRegionsByCountryCode,
// } from 'i18n-iso-countries-regions';
import { Country, City } from 'country-state-city';
import { useTheme, Box, Grid, TextField, Typography, Button, Autocomplete, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/system';
import EastIcon from '@mui/icons-material/East';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeviceApi } from '../../axios/ApiProvider';
import { io } from 'socket.io-client';
import { parsingDeviceData } from '../../axios/ParseProvider';
import { devMetaData_Store } from '../../store/actions/mainAction';
import dayjs from 'dayjs';


const EndPoint = process.env.REACT_APP_BASE_BACKEND_URL;
const tmpSocket = io(EndPoint);
const tCountry = Country.getAllCountries();
const vacationArr = [
  { start: null, end: null },
  { start: null, end: null },
  { start: null, end: null }
]
console.log('testing country', tCountry);
export const SettingBoards = ({ isMobile, isPortrait, devData, socketIo }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOwner, setIsOwner] = useState(false);
  const userData = useSelector(store => store.userData);
  const devMetaData = useSelector(store => store.devMetaData);
  // const allCountries = getAllCountriesName('en');
  const allCountries = Country.getAllCountries();
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [vacationList, setVacationList] = useState(vacationArr)
  const [startDayOpen, setStartDayOpen] = useState(null);
  const [endDayOpen, setEndDayOpen] = useState(null);

  // const [startDate, setStartDate] = useState();
  // const [endDate, setEndDate] = useState();
  const [maxWaterTemperature, setMaxWaterTemperature] = useState()

  const [deviceName, setDeviceName] = useState();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [watterLimit, setWatterLimit] = useState(100);
  const [watterLimitError, setWatterLimitError] = useState(false);
  const [solopanelPower, setSolopanelPower] = useState();
  const [priceKWH, setPriceKWH] = useState();
  const [isHeatSource, setIsHeatSource] = useState(false);
  const [heatType, setHeatType] = useState(1);
  const [heatValue, setHeatValue] = useState(4);

  const [installEmail, setInstallEmail] = useState('');
  const [installPhone, setInstallPhone] = useState();
  const [useDevType, setUseDevType] = useState('professional');
  const [occupants, setOccupants] = useState();
  const [boilerContact, setBoilerContact] = useState('owner')
  const [gpsLoc, setGPSLoc] = useState()

  const [isSetting, setIsSetting] = useState(false);

  useEffect(() => {

    devDataVacationParsing(devData)
    // setStartDate(vacationStart);
    // setEndDate(vacationEnd);
    console.log('checkingDevdata', devData);
    let countArr = [];
    if (devMetaData.attributes.devOwner === userData.id) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
    allCountries.map(countryItem => { countArr.push({ label: countryItem.name, iso: countryItem.isoCode }) })
    setCountryList(countArr);
    setDeviceName(devMetaData.attributes.DeviceName);
    const existCountry = countArr.find(ctItem => ctItem.label === devMetaData.attributes.country);
    setCountry(existCountry);
    // const regionArr = getRegionsByCountryCode('en', existCountry.iso);
    // const regionArr = City.getCitiesOfCountry(existCountry.iso)
    // let existRegionArr = [];
    // regionArr.map(reItem => { existRegionArr.push({ label: reItem.name, iso: reItem.stateCode }) })
    // const existRegion = existRegionArr.find(reItem => reItem.label === devMetaData.attributes.city)
    // console.log(existRegionArr, regionArr, existCountry)
    // setRegionList(existRegionArr);
    // setCity(existRegion);
    loadRegionList(existCountry, true);

    setWatterLimit(devMetaData.attributes.watterLimit);
    setSolopanelPower(devMetaData.attributes.solopanelPower);
    setPriceKWH(devMetaData.attributes.priceKWH)
    if (devMetaData.attributes.isHeatSource === "true") {
      setIsHeatSource(true)
    } else {
      setIsHeatSource(false)
    }
    setHeatType(parseInt(devMetaData.attributes?.heatType))
    setHeatValue(devMetaData.attributes?.heatValue)

    setUseDevType(devMetaData.attributes?.useDevType)
    setInstallEmail(devMetaData.attributes?.installEmail)
    setInstallPhone(devMetaData.attributes?.installPhone)
    setOccupants(devMetaData.attributes?.occupants)
    setBoilerContact(devMetaData.attributes?.boilerContact)
    setGPSLoc(devMetaData.attributes?.gpsLoc)
    console.log(devMetaData);
  }, [devMetaData])
  const devDataVacationParsing = (deviceData) => {
    const devStartVacations = deviceData.vacationStart;
    const devEndVacations = deviceData.vacationEnd;
    let tmpVacations = [];
    vacationArr.map((arrItem, key) => {
      arrItem.start = devStartVacations[key] === 0 ? null : dayjs(devStartVacations[key].toString(), 'DDMMYYYY', true);
      arrItem.end = devEndVacations[key] === 0 ? null : dayjs(devEndVacations[key].toString(), 'DDMMYYYY', true);
      tmpVacations.push(arrItem);
    });

    setVacationList(tmpVacations);
  }
  const onCountryChange = (e, value) => {
    // const regions = getRegionsByCountryCode('en', value.iso);
    loadRegionList(value, false)
    // const regions = City.getCitiesOfCountry(value.iso);
    // console.log('countryCode', regions, value);
    // let tmpList = [];
    // regions.map(resItem => {
    //   tmpList.push({ label: resItem.name, iso: resItem.stateCode })
    // })
    // setRegionList(tmpList)
    setCountry(value);
  }
  const loadRegionList = (value, isSetCity) => {
    if (value === null) { setRegionList([]); return; }
    const regions = City.getCitiesOfCountry(value.iso);

    console.log(regions);
    let tmpList = [];
    regions.map(resItem => {
      if (!tmpList.find(tmpItem => tmpItem.label === resItem.name)) {
        tmpList.push({ label: resItem.name, iso: resItem.stateCode })
      }
    })
    setRegionList(tmpList)
    if (isSetCity) {
      const existRegion = tmpList.find(reItem => reItem.label === devMetaData.attributes.city)
      setCity(existRegion);
    }
  }
  const onCityChange = (e, value) => {
    setCity(value);
  }
  const onWatterlimitChange = (e) => {
    console.log(e.target.value);
    if (parseInt(e.target.value) < 100 || parseInt(e.target.value) > 500) {
      setWatterLimitError(true);
      setWatterLimit(e.target.value)
    } else {
      setWatterLimitError(false);
      setWatterLimit(e.target.value)
    }
  }
  const onIsHeatSourceChange = (e) => {
    setIsHeatSource(e.target.checked)
  }
  const onHeatTypeChange = (e) => {
    console.log(e);
    setHeatType(e.target.value);
  }
  const onHeatValueChange = (e) => {
    setHeatValue(e.target.value);
  }

  const onChangeVacationStart = (key, newVal) => {
    const tmpVacationList = vacationList;
    tmpVacationList[key].start = newVal;
    setVacationList(tmpVacationList);
  }

  const onChangeVacationEnd = (key, newVal) => {
    const tmpVacationList = vacationList;
    tmpVacationList[key].end = newVal;
    setVacationList(tmpVacationList);
  }

  const onSettingSubmit = async (e) => {
    e.preventDefault();
    setIsSetting(true);
    if (e.target.checkValidity()) {
      const devMetaInfo = {
        DeviceName: deviceName,
        boilerContact: boilerContact,
        city: city.label,
        country: country.label,
        devOwner: userData.id,
        devOwnerEmail: userData.email,
        gpsLoc: gpsLoc,
        heatType: heatType,
        heatValue: heatValue,
        installEmail: installEmail,
        installPhone: installPhone,
        isHeatSource: isHeatSource,
        pairingCode: devMetaData.attributes.pairingCode,
        priceKWH: priceKWH,
        solopanelPower: solopanelPower,
        useDevType: useDevType,
        occupants: occupants,
        watterLimit: watterLimit,
        setMaxWaterTemp: maxWaterTemperature
      }
      let payload = {
        setNickname: deviceName,
        setMaxWaterTemp: maxWaterTemperature,
        setVacationPeriod: 1
      }
      const vacationStartArr = [];
      const vacationEndArr = [];
      vacationList.map(vacationItem => {
        const startDateStr = vacationItem.start ? `${vacationItem.start.$D}${(vacationItem.start.$M + 1).toString().padStart(2, '0')}${vacationItem.start.$y}` : '0';
        const endDateStr = vacationItem.end ? `${vacationItem.end.$D}${(vacationItem.end.$M + 1).toString().padStart(2, '0')}${vacationItem.end.$y}` : '0';
        vacationStartArr.push(startDateStr);
        vacationEndArr.push(endDateStr)
      })
      payload.startDate = vacationStartArr;
      payload.endDate = vacationEndArr;
      // if (startDate && endDate) {
      //   payload.setVacationPeriod = 1;
      //   payload.startDate = [`${startDate.$D}${(startDate.$M + 1).toString().padStart(2, '0')}${startDate.$y}`];
      //   payload.endDate = [`${endDate.$D}${(endDate.$M + 1).toString().padStart(2, '0')}${endDate.$y}`];
      // }
      const devInfo = {
        DeviceID: devData.DeviceID,
        payload: payload
      }

      tmpSocket.emit('devUpdate', { devInfo }, (error) => {
        if (error) {
          alert(error);
        }
      })
      const devPayLoad = {
        devId: devMetaData.id,
        devInfo: devMetaInfo
      }

      console.log('checking Submitting', devMetaInfo);
      const saveRes = await updateDeviceApi(devPayLoad);
      console.log(saveRes);
      if (saveRes.state === "success") {
        window.toastr.info(t('saved_successfully'));
        const savedMetaData = parsingDeviceData(saveRes.data);
        dispatch(devMetaData_Store(savedMetaData));
      } else {
        window.toastr.error(t('save_failed'));
      }

      setIsSetting(false);
    } else {
      setIsSetting(false);
    }
  }

  return (
    <>
      <Box width={"100%"} paddingX={isPortrait ? 0 : 3} paddingY={3}>
        <Box
          width={'100%'}
          height={'auto'}
          position={'relative'}
          backgroundColor={colors.primary[400]}
          padding={4}
          zIndex={0}
        >
          <Grid component={'form'} onSubmit={onSettingSubmit} container spacing={2}>
            <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <SettingsSuggestIcon fontSize="large" color='success' />
              {isOwner && <Button disabled={isSetting} type='submit' variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>
                {isSetting ? <CircularProgress size={20} /> : <>{t('save')}</>}
              </Button>}
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="outlined-basic" label={t('device_name')}
                variant="outlined" required size='small' disabled={!isOwner}
                value={deviceName} onChange={(e) => { setDeviceName(e.target.value) }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={countryList}
                value={country}
                onChange={onCountryChange}
                disabled={!isOwner}
                renderInput={(params) => <TextField {...params} label="Country" required InputLabelProps={{
                  shrink: true,
                }} />}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={regionList}
                value={city}
                onChange={onCityChange}
                renderInput={(params) => <TextField {...params} label="City" required InputLabelProps={{
                  shrink: true,
                }} />}
                disabled={!isOwner}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth id="outlined-basic" label={`${t('water_tank_limit')} (100 - 500)`}
                type="number" inputProps={{ min: 100, max: 500 }} disabled={!isOwner}
                value={watterLimit} onChange={(e) => { onWatterlimitChange(e) }}
                variant="outlined" size="small" required error={watterLimitError}
                InputLabelProps={{
                  shrink: true,
                }} />
            </Grid>
            <Grid item xs={6}>
              <TextField type="number" fullWidth id="outlined-basic" label={t('max_water_temperature')}
                variant="outlined" size='small' disabled={!isOwner} value={maxWaterTemperature} onChange={(e) => { setMaxWaterTemperature(e.target.value) }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField type="number" fullWidth id="outlined-basic" label={`${t('solopanel_max_power')} (Watts)`}
                variant="outlined" size="small" required disabled={!isOwner}
                value={solopanelPower} onChange={(e) => { setSolopanelPower(e.target.value); }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField type="number" fullWidth id="outlined-basic" label={`${t('price_per')} kW/h`}
                variant="outlined" required size='small' disabled={!isOwner}
                value={priceKWH} onChange={(e) => { setPriceKWH(e.target.value) }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box border={1} borderColor={'gray'} borderRadius={1} paddingX={1} paddingY={1}>
                <Grid container>
                  <Grid xs={isHeatSource ? 6 : 12}>
                    <FormControlLabel
                      value="start"
                      control={<Checkbox checked={isHeatSource} onChange={(e) => { onIsHeatSourceChange(e) }} color="success" disabled={!isOwner} />}
                      label={t('alternative_heat_source_available')}
                      labelPlacement="start"
                    />
                  </Grid>
                  {isHeatSource && <Grid xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-helper-label">{t('type_of_heat_source')}</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label={t('type_of_heat_source')}
                        value={heatType}
                        disabled={!isOwner}
                        onChange={(e) => { onHeatTypeChange(e) }}
                      >

                        <MenuItem value={1}>{t('electric_heater')}</MenuItem>
                        <MenuItem value={2}>{t('gas_boiler')}</MenuItem>
                        <MenuItem value={3}>{t('diesel_boiler')}</MenuItem>
                        <MenuItem value={4}>{t('pellet_boiler')}</MenuItem>
                        <MenuItem value={5}>{t('other')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>}
                  {(isHeatSource && heatType === 1) && <Grid xs={12} paddingTop={1}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-helper-label">{t('heat_resistor_value')}</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label={t('heat_resistor_value')}
                        value={heatValue}
                        disabled={!isOwner}
                        onChange={(e) => { onHeatValueChange(e) }}
                      >

                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>}
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid margin={0} width={'100%'} container spacing={1} padding={1} border={1} borderRadius={1}>
                  {vacationList.map((vacationItem, key) => (
                    <Grid key={key} item md={4} xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                      <DatePicker
                        sx={{ width: '100%' }}
                        label={t("vacation_period_start")}
                        value={vacationItem.start}
                        maxDate={vacationItem.end}
                        open={startDayOpen === key}
                        disabled={!isOwner}
                        onOpen={() => setStartDayOpen(key)}
                        onClose={() => setStartDayOpen(null)}
                        onChange={(newValue) => onChangeVacationStart(key, newValue)}
                        slotProps={{
                          textField: {
                            InputLabelProps: { shrink: true },
                            size: 'small',
                            onClick: () => setStartDayOpen(key)
                          }
                        }}
                      />
                      <Typography variant='body1'>
                        <EastIcon />
                      </Typography>
                      <DatePicker
                        sx={{ width: '100%' }}
                        label={t("vacation_period_end")}
                        value={vacationItem.end}
                        minDate={vacationItem.start}
                        open={endDayOpen === key}
                        disabled={!isOwner}
                        onOpen={() => setEndDayOpen(key)}
                        onClose={() => setEndDayOpen(null)}
                        onChange={(newValue) => onChangeVacationEnd(key, newValue)}
                        slotProps={{
                          textField: {
                            InputLabelProps: { shrink: true },
                            size: 'small',
                            onClick: () => setEndDayOpen(key)
                          }
                        }}
                      />
                    </Grid>))}
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Box border={1} borderColor={'gray'} borderRadius={1} paddingX={1} paddingY={1}>
                <Grid container>
                  <Grid item xs={useDevType === 'private' ? 6 : 12} padding={1}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-helper-label">{t('intended_use_of_device')}</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label={t('intended_use_of_device')}
                        value={useDevType}
                        disabled={!isOwner}
                        onChange={(e) => { setUseDevType(e.target.value) }}
                      >
                        <MenuItem value={'professional'}>{t('professional')}</MenuItem>
                        <MenuItem value={'private'}>{`${t('private')} (${t('home_use')})`}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {useDevType === 'private' && <Grid item xs={6} padding={1}>
                    <TextField type="number" fullWidth id="outlined-basic" label={t('number_of_occupants')}
                      disabled={!isOwner}
                      variant="outlined" size="small" value={occupants} onChange={(e) => { setOccupants(e.target.value) }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>}
                  <Grid item xs={6} padding={1}>
                    <TextField type="email" fullWidth id="outlined-basic" label={t('email')}
                      disabled={!isOwner}
                      variant="outlined" size="small" value={installEmail} onChange={(e) => { setInstallEmail(e.target.value) }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} padding={1}>
                    <TextField fullWidth id="outlined-basic" label={t('phone_number')}
                      disabled={!isOwner} 
                      variant="outlined" size="small" value={installPhone} onChange={(e) => { setInstallPhone(e.target.value) }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} padding={1}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-helper-label">{t('axinar_boilers_should_contact')}</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label={t('axinar_boilers_should_contact')}
                        value={boilerContact}
                        disabled={!isOwner}
                        onChange={(e) => { setBoilerContact(e.target.value) }}
                      >
                        <MenuItem value={'owner'}>{t('the_owner')}</MenuItem>
                        <MenuItem value={'technician'}>{t('the_installation_technician')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} padding={1}>
                    <TextField fullWidth id="outlined-basic" label={t('gps_location')}
                      disabled={!isOwner}
                      variant="outlined" size="small" value={gpsLoc} onChange={(e) => { setGPSLoc(e.target.value) }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}