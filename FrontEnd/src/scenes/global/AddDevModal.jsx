import React, { useRef, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardMedia, Checkbox, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "react-i18next";
import uploadIco from "../../assets/uploadIco.png"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export const AddDevModal = ({ isAddDev, onClose }) => {
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

  const [installEmail, setInstallEmail] = useState('');
  const [installPhone, setInstallPhone] = useState();
  const [useDevType, setUseDevType] = useState('professional');
  const [occupants, setOccupants] = useState();
  const [boilerContact, setBoilerContact] = useState('owner')
  const [gpsLoc, setGPSLoc] = useState()


  const onCountryChange = (e) => {
    setCountry(e.target.value);
  }
  const onCityChange = (e) => {
    setCity(e.target.value);
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

  const onNewDevSubmit = () => {
    console.log('submitting');
  }

  const uploaderPicker = () => {
    picuploader.current.click();
  }

  return (
    <Modal
      open={isAddDev}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ width: '100%' }}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            {t('add_new_device')}
          </Typography>
          <Grid component={'form'} onSubmit={() => { onNewDevSubmit() }} container direction={'row'} >
            <Grid xs={6} padding={1}>
              <TextField fullWidth id="outlined-basic" label={t('country')}
                value={country} variant="outlined" size="small" required
                onChange={(e) => { onCountryChange(e) }}
              />
            </Grid>
            <Grid xs={6} padding={1}>
              <TextField fullWidth id="outlined-basic" label={t('city')}
                value={city} variant="outlined" size="small" required
                onChange={(e) => { onCityChange(e) }}
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
              <Accordion >
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
                          sx={{ margin: 'auto' }}
                          image={uploadIco}
                          alt="uploader"
                        />
                      </Card>
                      <input type="file" hidden ref={picuploader} />
                    </Grid>
                    <Grid item xs={useDevType == 'private' ? 6 : 12} padding={1}>
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
                    {useDevType == 'private' && <Grid item xs={6} padding={1}>
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
              <Button variant="contained" color="error" sx={{ marginX: '5px', fontWeight: 'bold' }}>{t('cancel')}</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  )
}