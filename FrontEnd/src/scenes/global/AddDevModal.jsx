import React, { useRef, useState } from "react";
import {
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "react-i18next";
import uploadIco from "../../assets/uploadIco.png"
import { createDeviceApi, uploadDevImgApi } from "../../axios/ApiProvider";

import "./addDevModal.css"
import { useSelector } from "react-redux";

export const AddDevModal = ({ isAddDev, onClose, pairingData }) => {
  const userData = useSelector(store => store.userData);
  const picuploader = useRef();
  const { t } = useTranslation();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [watterLimit, setWatterLimit] = useState(100);
  const [watterLimitError, setWatterLimitError] = useState(false);
  const [isHeatSource, setIsHeatSource] = useState(false);
  const [heatType, setHeatType] = useState(1);
  const [heatValue, setHeatValue] = useState(4);
  const [solopanelPower, setSolopanelPower] = useState()
  const [installName, setInstalName] = useState()

  const [uploadImg, setUploadImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(uploadIco);
  const [installEmail, setInstallEmail] = useState('');
  const [installPhone, setInstallPhone] = useState();
  const [useDevType, setUseDevType] = useState('professional');
  const [occupants, setOccupants] = useState();
  const [boilerContact, setBoilerContact] = useState('owner')
  const [gpsLoc, setGPSLoc] = useState()

  const [isExpanded, setIsExpanded] = useState(false);

  const onCountryChange = (e) => {
    console.log('country Change', e);
    setCountry(e);
  }
  const onCityChange = (e) => {
    console.log(e);
    setCity(e);
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
    if (e.target.checkValidity()) {
      const devInfo = {
        country: country.name,
        city: city.name,
        watterLimit: watterLimit,
        isHeatSource: isHeatSource,
        solopanelPower: solopanelPower,
        installName: installName
      }
      if (isHeatSource) {
        devInfo.heatType = heatType;
        if (heatType === 1) {
          devInfo.heatValue = heatValue;
        }
      }
      if (isExpanded) {

        devInfo.useDevType = useDevType;
        devInfo.installEmail = installEmail;
        devInfo.installPhone = installPhone;
        devInfo.boilerContact = boilerContact;
        devInfo.gpsLoc = gpsLoc;
        if (uploadImg) {
          devInfo.devImage = uploadImg;
        }

      }
      const newDevData = {
        userId: userData.id,
        pairingData: pairingData,
        devInfo: devInfo
      }
      const createdRes = await createDeviceApi(newDevData);
      console.log(createdRes);
      if (createdRes.state === 'success') {
        onClose();
      }

    }
    e.preventDefault();
  }

  const uploaderPicker = () => {
    picuploader.current.click();
  }

  const chooseUploadfile = async (e) => {
    if (!e || !e.target || !e.target.files[0]) {
      // window.toastr.warning('file select error')
      return
    }
    // setUploadImg(e.target.files[0])
    let imgFile = e.target.files[0];
    const newImgUrl = URL.createObjectURL(imgFile);
    setPreviewImg(newImgUrl)
    const formData = new FormData()
    formData.append('image', imgFile);
    const uploadRes = await uploadDevImgApi(formData);
    console.log(uploadRes);
    if (uploadRes.status !== 200) return;

    setUploadImg(uploadRes.data);
    // console.log(uploadImg);
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
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {t('device_info')}
          </Typography>
          <Grid component={'form'} onSubmit={onNewDevSubmit} container direction={'row'} >
            <Grid xs={6} padding={1}>
              <CountrySelect
                onChange={(e) => { onCountryChange(e) }}
                value={country.id}
                placeHolder={t('country')}
              />
            </Grid>
            <Grid xs={6} padding={1}>
              <StateSelect
                countryid={country.id}
                onChange={(e) => { onCityChange(e) }}
                placeHolder="Select State"
              />
            </Grid>
            <Grid xs={12} padding={1}>
              <TextField fullWidth id="outlined-basic" label={`${t('water_tank_limit')} (100 - 500)`}
                type="number" inputProps={{ min: 100, max: 500 }} error={watterLimitError}
                value={watterLimit} onChange={(e) => { onWatterlimitChange(e) }}
                variant="outlined" size="small" required />
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
              />
            </Grid>
            <Grid xs={12} padding={1}>
              <TextField fullWidth id="outlined-basic" label={t('name_of_installation')}
                variant="outlined" size="small" required
                value={installName} onChange={(e) => { setInstalName(e.target.value) }}
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
                    <Grid item xs={12} padding={1}>
                      <Card onClick={() => { uploaderPicker() }}>
                        <CardMedia
                          component="img"
                          height="130"
                          width={'fit-content'}
                          sx={{ margin: 'auto', width: 'fit-content !important' }}
                          image={previewImg}
                          alt="uploader"
                        />
                      </Card>
                      <input type="file" hidden ref={picuploader} onChange={chooseUploadfile} accept=".jpg, .png" />
                    </Grid>
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
                      />
                    </Grid>}
                    <Grid item xs={6} padding={1}>
                      <TextField type="email" fullWidth id="outlined-basic" label={t('email')}
                        variant="outlined" size="small" value={installEmail} onChange={(e) => { setInstallEmail(e.target.value) }}
                      />
                    </Grid>
                    <Grid item xs={6} padding={1}>
                      <TextField fullWidth id="outlined-basic" label={t('phone_number')}
                        variant="outlined" size="small" value={installPhone} onChange={(e) => { setInstallPhone(e.target.value) }}
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
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid xs={12} padding={1} display={'flex'} justifyContent={'end'}>
              <Button variant="contained" type="submit" color="success" sx={{ marginX: '5px', fontWeight: 'bold' }}>{t('add')}</Button>
              <Button variant="contained" color="error" onClick={onClose} sx={{ marginX: '5px', fontWeight: 'bold' }}>{t('cancel')}</Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>

  )
}