import React, { useEffect, useState } from "react";
// import {
//   getAllCountriesName,
//   getRegionsByCountryCode,
// } from 'i18n-iso-countries-regions';
import { Country, City } from 'country-state-city';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "react-i18next";
// import uploadIco from "../../assets/uploadIco.png"
import loadingGif from "../../assets/loading.gif"
import { createDeviceApi } from "../../axios/ApiProvider";
import io from "socket.io-client";
import "./addDevModal.css"
import { useSelector } from "react-redux";

const EndPoint = process.env.REACT_APP_BASE_BACKEND_URL;
const tmpSocket = io(EndPoint);

export const AddDevModal = ({ isAddDev, onClose, pairingData, ipAddress }) => {
  // const allCountries = getAllCountriesName('en');
  const allCountries = Country.getAllCountries();
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const userData = useSelector(store => store.userData);
  // const picuploader = useRef();
  const { t } = useTranslation();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  // const [deviceName, setDeviceName] = useState('');
  const [watterLimit, setWatterLimit] = useState(100);
  const [watterLimitError, setWatterLimitError] = useState(false);
  const [isHeatSource, setIsHeatSource] = useState(false);
  const [heatType, setHeatType] = useState(1);
  const [heatValue, setHeatValue] = useState(4);
  const [solopanelPower, setSolopanelPower] = useState();
  const [installName, setInstalName] = useState();
  const [priceKWH, setPriceKWH] = useState();

  // const [uploadImg, setUploadImg] = useState(null);
  // const [previewImg, setPreviewImg] = useState(uploadIco);
  const [installEmail, setInstallEmail] = useState('');
  const [installPhone, setInstallPhone] = useState();
  const [useDevType, setUseDevType] = useState('professional');
  const [occupants, setOccupants] = useState();
  const [boilerContact, setBoilerContact] = useState('owner')
  const [gpsLoc, setGPSLoc] = useState()

  const [isExpanded, setIsExpanded] = useState(false);

  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    const tmpList = [];
    allCountries.map(ctItem => { tmpList.push({ label: ctItem.name, iso: ctItem.isoCode }) });
    setCountryList(tmpList);
    console.log(pairingData);
  }, [pairingData, isAddDev])

  const onCountryChange = (e, value) => {
    console.log('country Change', e, value);
    // const regions = getRegionsByCountryCode('en', value.iso);
    const regions = City.getCitiesOfCountry(value.iso);
    // console.log(regions);
    let tmpList = [];
    regions.map(resItem => {
      tmpList.push({ label: resItem.name, iso: resItem.stateCode })
    })
    setRegionList(tmpList)
    setCountry(value);
  }
  const onCityChange = (e, value) => {
    console.log(e);
    setCity(value);
  }

  const onHeatValueChange = (e) => {
    setHeatValue(e.target.value);
  }

  const onHeatTypeChange = (e) => {
    console.log(e);
    setHeatType(e.target.value);
  }

  const onIsHeatSourceChange = (e) => {
    console.log(e);
    setIsHeatSource(e.target.checked)
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

  const onSoloPanelPowerChange = (e) => {
    setSolopanelPower(e.target.value);
  }

  const onNewDevSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    if (e.target.checkValidity()) {
      const devMetaInfo = {
        country: country.label,
        city: city.label,
        watterLimit: watterLimit,
        isHeatSource: isHeatSource,
        solopanelPower: solopanelPower,
        DeviceName: installName,
        priceKWH: priceKWH
      }

      const devInfo = {
        DeviceID: pairingData.deviceId,
        payload: {
          setNickname: installName
        }
      }

      tmpSocket.emit('devUpdate', { devInfo }, (error) => {
        if (error) {
          alert(error);
        }
      })
      if (isHeatSource) {
        devMetaInfo.heatType = heatType;
        if (heatType === 1) {
          devMetaInfo.heatValue = heatValue;
        }
      }
      if (isExpanded) {
        devMetaInfo.useDevType = useDevType;
        if (useDevType === 'private') {
          devMetaInfo.occupants = occupants;
        }
        devMetaInfo.installEmail = installEmail;
        devMetaInfo.installPhone = installPhone;
        devMetaInfo.boilerContact = boilerContact;
        devMetaInfo.gpsLoc = gpsLoc;
      }
      const newDevData = {
        userId: userData.id,
        userEmail: userData.email,
        pairingData: pairingData,
        devInfo: devMetaInfo
      }
      const createdRes = await createDeviceApi(newDevData);
      console.log(createdRes);
      if (createdRes.state === 'success') {
        onClose();
      } else {
        setIsSubmiting(false);
      }
    } else {
      setIsSubmiting(false);
    }
    e.preventDefault();
  }

  const onAccodionChange = (e, expanded) => {
    console.log(e, expanded);
    setIsExpanded(expanded);
  }

  return (
    <Dialog
      open={isAddDev}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Box sx={{ position: "relative", width: '100%' }}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {t('device_info')}
          </Typography>
          <Grid component={'form'} onSubmit={onNewDevSubmit} container direction={'row'} >
            <Grid xs={6} padding={1}>
              <Autocomplete
                options={countryList}
                onChange={onCountryChange}
                renderInput={(params) => <TextField {...params} label="Country" InputLabelProps={{
                  shrink: true,
                }} required />}
                size="small"

              />
            </Grid>
            <Grid xs={6} padding={1}>
              <Autocomplete
                options={regionList}
                onChange={onCityChange}
                renderInput={(params) => <TextField {...params} label="City" InputLabelProps={{
                  shrink: true,
                }} required />}
                size="small"
              />
            </Grid>
            <Grid xs={12} padding={1}>
              <TextField fullWidth id="outlined-basic" label={`${t('water_tank_limit')} (100 - 500)`}
                type="number" inputProps={{ min: 100, max: 500 }} error={watterLimitError}
                value={watterLimit} onChange={(e) => { onWatterlimitChange(e) }}
                variant="outlined" size="small" required InputLabelProps={{
                  shrink: true,
                }} />
            </Grid>
            <Grid xs={12} padding={1}>
              <Box border={1} borderColor={'gray'} borderRadius={1} paddingX={1} paddingY={1}>
                <Grid container>
                  <Grid xs={isHeatSource ? 6 : 12}>
                    <FormControlLabel
                      value="start"
                      control={<Checkbox checked={isHeatSource} onChange={(e) => { onIsHeatSourceChange(e) }} color="success" />}
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
            <Grid xs={12} padding={1}>
              <TextField type="number" fullWidth id="outlined-basic" label={`${t('solopanel_max_power')} (Watts)`}
                variant="outlined" size="small" required value={solopanelPower}
                onChange={(e) => { onSoloPanelPowerChange(e) }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid xs={6} padding={1}>
              <TextField fullWidth id="outlined-basic" label={t('name_of_installation')}
                variant="outlined" size="small" required
                value={installName} onChange={(e) => { setInstalName(e.target.value) }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid xs={6} padding={1}>
              <TextField fullWidth type="number" id="outlined-basic" label={`${t('price_per')} kW/h`}
                variant="outlined" size="small" required
                value={priceKWH} onChange={(e) => { setPriceKWH(e.target.value) }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid xs={12}>
              <Accordion expanded={isExpanded} onChange={(e, expanded) => onAccodionChange(e, expanded)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ minHeight: '40px', '& .MuiAccordionSummary-content': { marginY: '5px !important' }, '&.Mui-expanded': { minHeight: '40px' } }}
                >
                  {t('more_fields')}
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <Grid container>
                    <Grid item xs={useDevType === 'private' ? 6 : 12} padding={1}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-helper-label">{t('intended_use_of_device')}</InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          label={t('intended_use_of_device')}
                          value={useDevType}
                          onChange={(e) => { setUseDevType(e.target.value) }}
                        >
                          <MenuItem value={'professional'}>{t('professional')}</MenuItem>
                          <MenuItem value={'private'}>{`${t('private')} (${t('home_use')})`}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {useDevType === 'private' && <Grid item xs={6} padding={1}>
                      <TextField type="number" fullWidth id="outlined-basic" label={t('number_of_occupants')}
                        variant="outlined" size="small" value={occupants} onChange={(e) => { setOccupants(e.target.value) }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>}
                    <Grid item xs={6} padding={1}>
                      <TextField type="email" fullWidth id="outlined-basic" label={t('email')}
                        variant="outlined" size="small" value={installEmail} onChange={(e) => { setInstallEmail(e.target.value) }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} padding={1}>
                      <TextField fullWidth id="outlined-basic" label={t('phone_number')}
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
                          onChange={(e) => { setBoilerContact(e.target.value) }}
                        >
                          <MenuItem value={'owner'}>{t('the_owner')}</MenuItem>
                          <MenuItem value={'technician'}>{t('the_installation_technician')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} padding={1}>
                      <TextField fullWidth id="outlined-basic" label={t('gps_location')}
                        variant="outlined" size="small" value={gpsLoc} onChange={(e) => { setGPSLoc(e.target.value) }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid xs={12} padding={1} display={'flex'} justifyContent={'end'}>
              <Button disabled={isSubmiting} variant="contained" type="submit" color="success" sx={{ marginX: '5px', fontWeight: 'bold' }}>{t('add')}</Button>
              <Button disabled={isSubmiting} variant="contained" color="error" onClick={onClose} sx={{ marginX: '5px', fontWeight: 'bold' }}>{t('cancel')}</Button>
            </Grid>
          </Grid>
          {isSubmiting && <Box className='submit-loading'>
            <img src={loadingGif} alt="loading" width={150} height={150} />
          </Box>}
        </Box>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>

  )
}