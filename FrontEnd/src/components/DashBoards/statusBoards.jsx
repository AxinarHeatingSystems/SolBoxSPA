import React, { useEffect, useRef, useState } from 'react';
import { useTheme, styled, Box, Typography, Switch, FormControlLabel, Grid, Chip } from "@mui/material";
import GaugeComponent from 'react-gauge-component'
import { tokens } from "../../theme";
import './statusBoard.css';
import sunglus from '../../assets/sumimg/sunglus.svg'
import sunface from '../../assets/sumimg/sunface.svg'
import sunSad from '../../assets/sumimg/sunsleep.svg'
import { HeatDev } from '../DeviceComponents/heatDev';
import { SolarPanel } from '../DeviceComponents/solarPanel';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { WaterTank } from '../DeviceComponents/waterTank';
import { display, Stack } from '@mui/system';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 64,
  height: 34,
  padding: 0,
  borderRadius: '16px',
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(26px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M15,16.372a7.5,7.5,0,1,0-6,0V18h6ZM14.3,9.6l-3,4a1,1,0,1,1-1.6-1.2L11.5,10h-1a1,1,0,0,1-.832-1.555l2-3a1,1,0,0,1,1.664,1.11L12.369,8H13.5a1,1,0,0,1,.8,1.6ZM9,20h6v1a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1Z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#8796A5',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 56 56"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M 30.1328 .8711 C 24.1328 .8711 19.2577 3.0742 16.0937 6.8477 L 42.0624 32.8399 C 44.4062 29.3242 48.1328 25.4336 48.1328 18.6602 C 48.1328 7.9961 40.9374 .8711 30.1328 .8711 Z M 47.4531 47.3477 C 48.2031 48.0742 49.3045 48.0508 50.0077 47.3477 C 50.7109 46.6445 50.7344 45.4961 50.0077 44.7930 L 8.5233 3.2617 C 7.7968 2.5586 6.6249 2.5821 5.9453 3.2617 C 5.2656 3.9648 5.2890 5.1602 5.9453 5.8164 Z M 21.6484 43.1524 L 36.4374 43.1524 C 36.8593 43.1524 37.1171 42.9180 37.1171 42.4961 L 37.1171 40.9727 L 12.3906 16.2227 C 12.2031 16.9727 12.1328 17.7930 12.1328 18.6602 C 12.1328 28.7852 20.3593 32.4414 20.3593 38.1133 L 20.3593 41.8633 C 20.3593 42.6602 20.8515 43.1524 21.6484 43.1524 Z M 22.5155 49.4805 L 37.7499 49.4805 C 38.9453 49.4805 39.9062 48.4961 39.9062 47.2774 C 39.9062 46.0586 38.9453 45.0742 37.7499 45.0742 L 22.5155 45.0742 C 21.3202 45.0742 20.3593 46.0586 20.3593 47.2774 C 20.3593 48.4961 21.3202 49.4805 22.5155 49.4805 Z M 30.1328 55.1289 C 33.3671 55.1289 35.6406 53.6524 35.8749 51.3789 L 24.3906 51.3789 C 24.5780 53.6524 26.8749 55.1289 30.1328 55.1289 Z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));
const DevOnOffSwitch = styled(Switch)(({ theme }) => ({
  width: 64,
  height: 34,
  padding: 0,
  borderRadius: '16px',
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(26px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 32 32"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M16 10.75c-2.899 0-5.25 2.351-5.25 5.25s2.351 5.25 5.25 5.25c2.899 0 5.25-2.351 5.25-5.25v0c-0.004-2.898-2.352-5.246-5.25-5.25h-0zM16 18.75c-1.519 0-2.75-1.231-2.75-2.75s1.231-2.75 2.75-2.75c1.519 0 2.75 1.231 2.75 2.75v0c-0.002 1.518-1.232 2.748-2.75 2.75h-0zM16 9.25c0.69 0 1.25-0.56 1.25-1.25v0-1c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 1c0 0.69 0.56 1.25 1.25 1.25v0zM16 22.75c-0.69 0-1.25 0.56-1.25 1.25v1c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-1c-0-0.69-0.56-1.25-1.25-1.25h-0zM9.25 16c0-0.69-0.56-1.25-1.25-1.25v0h-1c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h1c0.69 0 1.25-0.56 1.25-1.25v0zM25 14.75h-1c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h1c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM9.459 11.227c0.226 0.226 0.539 0.366 0.884 0.366 0.69 0 1.25-0.56 1.25-1.25 0-0.345-0.14-0.658-0.366-0.884v0l-0.707-0.707c-0.226-0.226-0.539-0.366-0.884-0.366-0.69 0-1.25 0.56-1.25 1.25 0 0.345 0.14 0.658 0.366 0.884v0zM22.541 20.771c-0.226-0.225-0.538-0.364-0.882-0.364-0.691 0-1.251 0.56-1.251 1.251 0 0.344 0.139 0.656 0.364 0.882l0.707 0.707c0.226 0.226 0.539 0.366 0.884 0.366 0.691 0 1.251-0.56 1.251-1.251 0-0.345-0.14-0.658-0.366-0.884l0 0zM9.459 20.771l-0.707 0.707c-0.225 0.226-0.364 0.538-0.364 0.882 0 0.691 0.56 1.251 1.251 1.251 0.344 0 0.655-0.139 0.881-0.363l0.707-0.707c0.227-0.226 0.367-0.539 0.367-0.885 0-0.691-0.56-1.251-1.251-1.251-0.345 0-0.658 0.14-0.884 0.366v0zM21.656 11.593c0.001 0 0.001 0 0.002 0 0.345 0 0.657-0.14 0.883-0.366l0.707-0.707c0.224-0.226 0.363-0.537 0.363-0.881 0-0.691-0.56-1.251-1.251-1.251-0.344 0-0.656 0.139-0.882 0.364l-0.707 0.707c-0.226 0.226-0.366 0.539-0.366 0.884 0 0.69 0.56 1.25 1.25 1.25 0 0 0.001 0 0.001 0h-0z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#8796A5',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="5 5 500 500"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M245,0C109.5,0,0,109.5,0,245s109.5,245,245,245s245-109.5,245-245S380.5,0,245,0z M40.7,245 c0-105.6,80.6-192.8,183.5-203.3v406.6C121.3,437.8,40.7,350.6,40.7,245z M265.9,448.3V41.7C368.7,52.2,449.3,139.4,449.3,245 S368.7,437.8,265.9,448.3z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}))


export const StatusBoards = ({ isMobile, isPortrait, devData, socketIo }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const gaugeRef = useRef();
  const colors = tokens(theme.palette.mode);
  const userData = useSelector(store => store.userData);
  const devMetaData = useSelector(store => store.devMetaData);
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [heatOn, setHeatOn] = useState(true);
  const [devOn, setDevOn] = useState(true);
  const [maxVal, setMaxVal] = useState(100);
  const [maxPower, setMaxPower] = useState(10);
  const [minPower, setMinPower] = useState(0);
  const [nowPower, setNowPower] = useState(0);
  const [lastDayPower, setLastDayPower] = useState(0);
  const [todayKWH, setTodayKWH] = useState(0);
  const [savePrice, setSavePrice] = useState(0);
  const [priceKWH, setPriceKWH] = useState(0);
  const [isUser, setIsUser] = useState(null);
  const [devCyle, setDevCycle] = useState('');
  const [devPower, setDevPower] = useState(0);
  const [isDevFault, setIsDevFault] = useState(false);
  const [faultMsg, setFaultMsg] = useState('');
  const [isHeatAlert, setIsHeatAlert] = useState(false)
  const [heatFault, setHeatFault] = useState('');

  // console.log(userData);
  useEffect(() => {
    if (userData.attributes) {
      const attrArr = Object.keys(userData.attributes);
      const isUserTypeKey = attrArr.find(item => item === 'userType');
      if (isUserTypeKey && userData.attributes[isUserTypeKey][0] === 'user') {
        setIsUser('user');
      } else {
        setIsUser('technician');
      }
    }
    console.log('gaugeRef', gaugeRef.current.querySelector('.pointer'), gaugeRef.current.querySelector('.pointer').querySelector('text'))
    // if (gaugeRef.current.querySelector('.pointer').querySelector('text')) {
    // gaugeRef.current.querySelector('.pointer').insertAdjacentHTML("beforeend", pointerHtml);
    // }


  }, [])
  useEffect(() => {
    // console.log('gaugeRef', gaugeRef.current.querySelector('.pointer'), gaugeRef.current.querySelector('.pointer').querySelector('text'))


    if (isUser) {
      console.log(devData)
      setDeviceId(devData.DeviceID)
      setDeviceName(devData.DeviceName)
      setDevOn(devData.DeviceEnabled);
      setHeatOn(devData.RelayEnabled);
      // setMaxPower(parseInt((devData.maxPowerPer / devData.leastPowerThirty) * 100));
      // setMinPower(parseInt((devData.minPowerPer / devData.leastPowerThirty) * 100));
      // setNowPower(parseInt((devData.powerNeedlePer / devData.leastPowerThirty) * 100))

      setTodayKWH(parseFloat(devData.WattHours / 1000).toFixed(2));
      const tmpPriceKWH = devMetaData.attributes.priceKWH;
      setPriceKWH(tmpPriceKWH)
      setSavePrice(parseFloat((devData.WattHours / 1000) * tmpPriceKWH).toFixed(2));
      // setMaxVal(parseFloat(devData.ATHwattHours));
      if (devData.HeatsinkTempAlert === true) {
        setIsHeatAlert(true);
        setHeatFault(t('device_temp'))
      } else {
        setIsHeatAlert(false)
        setHeatFault('')
      }
      setDevPower(devData.DutyCycle);
      if (devData.LoadFaultFlag !== 0 || devData.WaterTempAlert === true) {
        setIsDevFault(true);
        setDevPower(0);
        if (devData.LoadFaultFlag !== 0) {
          setFaultMsg(t('load_fault'))
        }
        if (devData.WaterTempAlert === true) {
          setFaultMsg(t('water_temp'))
        }
      }
      if (isUser === 'user') {
        setDevCycle(`${parseInt(devData.DutyCycle)} %`);
        setMaxPower(parseInt(devData.maxPowerPer));
        setMinPower(parseInt(devData.minPowerPer));
        setNowPower(parseInt(devData.powerNeedlePer));
        setMaxVal(100);
      } else {
        setDevCycle(`${parseInt(devData.PowerIn)} W`);
        if (parseFloat(devData.ATHwattHours) < parseFloat(devData.maxPowerThirty)) {
          setMaxPower(parseFloat(devData.ATHwattHours));
        } else {
          setMaxPower(parseFloat(devData.maxPowerThirty));
        }
        setMinPower(parseFloat(devData.leastPowerThirty));
        setNowPower(parseFloat(devData.WattHours));
        setMaxVal(devData.ATHwattHours);

      }
      const tmpLastDayPower = Math.ceil((devData.lastDayWattHours / devData.ATHwattHours) * 100);
      setLastDayPower(tmpLastDayPower);
      const pointerHtml = `<text transform="rotate(0)" style="font-size: 15.4132px;transform: translate(0px, -4px);fill: rgb(117 116 116);text-shadow: black 1px 0.5px 0px, black 0px 0px 0.03em, black 0px 0px 0.01em;text-anchor: middle;">${tmpLastDayPower}%</text>`;
      if (!!gaugeRef.current.querySelector('.pointer').querySelector('text')) {
        gaugeRef.current.querySelector('.pointer').querySelector('text').innerHTML = `${tmpLastDayPower}%`;
      } else {
        console.log('NNNN')
        gaugeRef.current.querySelector('.pointer').insertAdjacentHTML("beforeend", pointerHtml);
      }
    }
    // console.log('gaugeRef', gaugeRef)
  }, [devData])


  const onHeatCtr = () => {

    const devInfo = {
      DeviceID: devData.DeviceID,
      payload: {
        manualRelayEnable: !heatOn ? 1 : 0,
        pauseCharging: devOn ? 1 : 0,
      }
    }

    socketIo.emit('devUpdate', { devInfo }, (error) => {
      if (error) {
        alert(error);
      }
    })
  }

  const onDevCtr = () => {
    // const devInfo = devData;
    // devInfo.DeviceEnabled = !devOn;
    const devInfo = {
      DeviceID: devData.DeviceID,
      payload: {
        manualRelayEnable: heatOn ? 1 : 0,
        pauseCharging: !devOn ? 1 : 0,
      }
    }
    // const payloadStr = JSON.stringify(devInfo);
    console.log('DevCTR', devInfo);
    socketIo.emit('devUpdate', { devInfo }, (error) => {
      if (error) {
        alert(error);
      }
    })
  }

  return (
    <Box display={isPortrait ? 'block' : 'flex'} gap="20px" sx={isPortrait ? {} : { transform: 'scaleY(0.9) translateY(-15px)', paddingX: '20px', height: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
      <Box gridColumn="span 8" gap="20px" marginY={isPortrait ? '0.5rem' : 0} sx={isPortrait ? {} : { height: '100%' }}>
        <Box
          width={'100%'}
          height={isPortrait ? 'auto' : '100%'}
          position={'relative'}
          backgroundColor={colors.primary[400]}
          zIndex={0}
        >
          <Grid container paddingX={5} paddingTop={isMobile ? isPortrait ? 7 : 2 : 5} paddingBottom={isMobile ? 0 : 5} justifyContent={'space-between'} alignItems={'center'}>
            <Grid order={{ xs: 1, md: 1 }} backgroundColor={colors.primary[400]} zIndex={1} item>
              <Box textAlign={'center'}>
                {!(isMobile && isPortrait) && <FormControlLabel
                  sx={{ margin: 'auto' }}
                  onClick={() => onHeatCtr()}
                  control={<MaterialUISwitch sx={{ m: 1 }} checked={heatOn} />}
                  label=""
                />}
                <HeatDev isMobile={isMobile} isPortrait={isPortrait} isOn={heatOn} isHeatAlert={isHeatAlert} heatFault={heatFault} />
              </Box>
            </Grid>

            <Grid order={isMobile ? { xs: 3 } : { xs: 2, md: 2 }} margin={'auto'} zIndex={1} item>
              <WaterTank isMobile={isMobile} isPortrait={isPortrait} WaterTemp={parseFloat(devData.WaterTemp).toFixed(1)} bgColor={colors.primary[400]} />
            </Grid>
            <Grid order={isMobile ? { xs: 2 } : { xs: 3, md: 3 }} backgroundColor={colors.primary[400]} zIndex={1} item>
              <Box textAlign={'center'}>
                {!(isMobile && isPortrait) && <FormControlLabel
                  sx={{ margin: 'auto', width: '100%', justifyContent: 'center', alignItems: "center", color: theme.palette.mode === "dark" ? 'yellow' : 'gray', fontSize: '16px !important', fontWeight: '600' }}
                  onClick={() => onDevCtr()}
                  control={<DevOnOffSwitch sx={{ m: 1 }} checked={devOn} />}
                />}
                <SolarPanel isMobile={isMobile} isPortrait={isPortrait} isOn={devOn} cycleVal={isDevFault ? faultMsg : devCyle} color={isDevFault ? 'red' : colors.greenAccent[400]} />
              </Box>
            </Grid>
          </Grid>

          <Grid className='dev-connector' container paddingX={10} justifyContent={'center'} alignItems={'center'}>
            {!isMobile && <>
              <Grid item xs={6} paddingX={4}>
                <div className='heat-connect'>
                  <hr />
                  {heatOn &&
                    <>
                      <span className='heat-cirl'></span>
                      <span className='heat-cirl cirl1'></span>
                      <span className='heat-cirl cirl2'></span>
                      <span className='heat-cirl cirl3'></span>
                      <span className='heat-cirl cirl4'></span>
                      <span className='heat-cirl cirl5'></span>
                      <span className='heat-cirl cirl6'></span>
                      <span className='heat-cirl cirl7'></span>
                      <span className='heat-cirl cirl8'></span>
                      <span className='heat-cirl cirl9'></span>
                      <span className='heat-cirl cirl10'></span>
                      <span className='heat-cirl cirl11'></span>
                      <span className='heat-cirl cirl12'></span>
                  </>
                  }

                </div>
              </Grid>
              <Grid item xs={6} paddingX={4}>
                <div className='solor-connect'>
                  <hr />
                  {devOn &&
                    <>
                    {(() => {
                      const arr = [];
                      for (let i = 0; i < (Math.floor(parseFloat(devPower) * 0.1) + 1); i++) {
                        arr.push(
                          <span className={`solor-cirl cirl${i}`}></span>
                        );
                      }
                      return arr;
                    })()}
                  </>
                  }
                </div>
              </Grid>
            </>}
            {isMobile && <>
              <Grid item xs={12} marginX={'auto'} marginTop={'-25%'}>
                <Box className="dev-connect-border" sx={{}}>
                  <Box className={heatOn ? "connect-content heat-connect-border" : "connect-content"}>
                    {heatOn && <>
                      {(() => {
                        const arr = [];
                        for (let i = 0; i < 10; i++) {
                          arr.push(
                            <span className={`mobile-heat-cirl cirl${i}`}></span>
                          );
                        }
                        return arr;
                      })()}
                    </>}
                  </Box>
                  <Box className={devOn ? "connect-content solar-connect-border" : "connect-content"}>
                    {devOn && <>
                      {(() => {
                        const arr = [];
                        for (let i = 0; i < (Math.floor(parseFloat(devPower) * 0.1) + 1); i++) {
                          arr.push(
                            <span className={`mobile-solar-cirl cirl${i}`}></span>
                          );
                        }
                        return arr;
                      })()}
                    </>}
                  </Box>
                </Box>
              </Grid>
            </>}

          </Grid>
          {(isMobile && isPortrait) && <Stack position={'absolute'} zIndex={999} bottom={0} direction={'row'} spacing={1} justifyContent={'space-between'} width={'100%'}>
            <Box width={'100%'} textAlign={'center'}>
              <FormControlLabel
                sx={{ margin: 'auto' }}
                onClick={() => onHeatCtr()}
                control={<MaterialUISwitch sx={{ m: 1 }} checked={heatOn} />}
                label=""
              />
            </Box>
            <Box width={'100%'} textAlign={'center'}>
              <FormControlLabel
                sx={{ margin: 'auto', width: '100%', justifyContent: 'center', alignItems: "center", color: theme.palette.mode === "dark" ? 'yellow' : 'gray', fontSize: '16px !important', fontWeight: '600' }}
                onClick={() => onDevCtr()}
                control={<DevOnOffSwitch sx={{ m: 1 }} checked={devOn} />}
              />
            </Box>
          </Stack>}
          {isMobile && isPortrait && < Box className="dev-label">
            <Typography variant='h4' fontWeight={700}>{deviceName}</Typography>
            <Typography variant='body1'>{deviceId}</Typography>
          </Box>}
        </Box>

      </Box>
      {/* GRID & CHARTS */}
      <Box gridColumn="span 4" sx={isPortrait ? {} : { height: '100%' }}>
        <Grid container spacing={3} sx={isPortrait ? {} : { marginTop: '0 !important', height: '100%' }}>
          <Grid item md={7} xs={12} sx={isPortrait ? {} : { minWidth: '100%', height: '100%', paddingTop: '0 !important' }}>
            <Box
              backgroundColor={colors.primary[400]}
              sx={isPortrait ? { height: 'fit-content' } : { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              textAlign={'center'}
              position={'relative'}
            >
              <Box position={'relative'} paddingBottom={isMobile ? 0 : 2}>
                <Box position={'relative'}>
                  <GaugeComponent
                    type="semicircle"
                    arc={{
                      width: 0.1,
                      padding: 0.01,
                      cornerRadius: 10,
                      colorArray: ['#f0f0', '#ff00', '#0ff0'],

                      // gradient: true,
                      // subArcs: [
                      //   {
                      //     className: 'arc1',
                      //     limit: minPower,
                      //     color: '#0000ff',
                      //     showTick: false,
                      //     tooltip: {
                      //       text: 'Too low temperature!'
                      //     },
                      //     onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                      //     onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                      //     onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
                      //   },
                      //   {
                      //     limit: maxPower,
                      //     color: '#30a130',
                      //     showTick: false,
                      //     tooltip: {
                      //       text: 'Low temperature!'
                      //     }
                      //   },
                      //   {
                      //     color: '#ef290b',
                      //     tooltip: {
                      //       text: 'Too high temperature!'
                      //     }
                      //   }
                      // ]
                    }}
                    pointer={{
                      color: '#345243',
                      length: 0.80,
                      width: 15,
                      elastic: true,
                    }}
                    labels={{
                      tickLabels: {
                        hideMinMax: true,
                      }
                    }}
                    // pointer={{ type: "blob", animationDelay: 0 }}
                    value={nowPower}
                    minValue={0}
                    maxValue={maxVal}
                  />
                  <div ref={gaugeRef} className='overide-gauge'>
                    <GaugeComponent

                      type='semicircle'
                      arc={{
                        width: 0.1,
                        padding: 0.01,
                        cornerRadius: 10,
                        // gradient: true,
                        subArcs: [
                          {
                            className: 'arc1',
                            limit: minPower,
                            color: '#0000ff',
                            showTick: true,
                            tooltip: {
                              style: { zIndex: 99999, position: 'fixed' },
                              text: 'Too low temperature!'
                            },
                            onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                            onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                            onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
                          },
                          {
                            limit: maxPower,
                            color: '#30a130',
                            showTick: true,
                            tooltip: {
                              style: { zIndex: 99999, position: 'fixed' },
                              text: 'Low temperature!'
                            }
                          },
                          {
                            color: '#ef290b',
                            showTick: true,
                            tooltip: {
                              style: { zIndex: 99999, position: 'fixed' },
                              text: 'Too high temperature!'
                            }
                          }
                        ]
                      }}
                      pointer={{
                        type: "blob", animationDelay: 0, elastic: true, tooltip: {
                          text: 'show Yesterday'
                        }
                      }}
                      labels={{ valueLabel: { style: { position: 'absolute', display: 'none' } } }}
                      value={lastDayPower}
                      minValue={0}
                      maxValue={maxVal}
                    />
                  </div>
                </Box>


                <Grid position={'absolute'} container spacing={1} paddingX={7} justifyContent={'space-between'}
                  sx={{ top: isMobile ? '-10px' : 0, width: '100%', height: '100%' }}
                >
                  <Grid item sx={{ height: '100%' }}>
                    <img alt='sunSad' src={sunSad} width={30} style={{ position: 'relative', top: 'calc(100% - 25px)', }} />
                  </Grid>
                  <Grid item sx={{ height: '100%' }} alignItems={'center'}>
                    <img alt='sunFace' src={sunface} width={30} style={{ position: 'relative', top: '60px' }} />
                  </Grid>
                  <Grid item sx={{ height: '100%' }}>
                    <img alt='sunGlus' src={sunglus} width={30} style={{ position: 'relative', top: 'calc(100% - 25px)' }} />
                  </Grid>

                </Grid>
              </Box>
              {/* <GaugeChart id="gauge-chart1" /> */}
              {(isMobile && !isPortrait) && <Grid xs={12} container spacing={1} paddingX={1} paddingTop={0} paddingBottom={1} marginTop={-1}>
                <Grid item xs={12} paddingX={1}>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'end'}
                    style={{ borderBottom: '3px solid', paddingBottom: '2px', flexWrap: 'wrap' }}>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ color: colors.grey[100] }}
                    >
                      {t("today")}
                    </Typography>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      sx={{ color: colors.grey[100] }}
                    >
                      {todayKWH} kwh
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} paddingX={1}>
                  <Box display={'flex'} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'end'}
                    sx={{ borderBottom: '3px solid', paddingBottom: '2px' }}>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ color: colors.grey[100], display: 'flex', justifyContent: 'start', alignItems: 'baseline' }}
                    >
                      {t("saved")} 
                      <Typography variant='body1' fontWeight={'bold'} sx={{ marginX: '0.3rem', color: colors.grey[100] }}>
                        ({priceKWH} € / kwh)
                      </Typography>
                    </Typography>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      sx={{ color: colors.grey[100], textWrap: 'nowrap' }}
                    >
                      {savePrice} €
                    </Typography>
                  </Box>
                </Grid>
              </Grid>}
            </Box>
          </Grid>
          {!isMobile && <Grid item md="5" xs="12">
            <Box
              backgroundColor={colors.primary[400]}
              padding={5}
              sx={{ height: '100%' }}
            >
              <Box margin={2} display={'flex'} justifyContent={'space-between'} alignItems={'end'}
                sx={{ borderBottom: '3px solid', paddingBottom: '10px', flexWrap: 'wrap' }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {t("today")}
                </Typography>
                <Typography
                  variant='h1'
                  fontWeight='bold'
                  sx={{ color: colors.grey[100], textWrap: 'nowrap' }}
                >
                  {todayKWH} kwh
                </Typography>
              </Box>
              <Box margin={2} display={'flex'} justifyContent={'space-between'} alignItems={'end'}
                sx={{ borderBottom: '3px solid', paddingBottom: '10px', flexWrap: 'wrap' }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100], display: 'flex', justifyContent: 'start', alignItems: 'baseline', flexWrap: 'nowrap', textWrap: 'nowrap' }}
                >
                  {t("saved")} 
                  <Typography variant='body1' fontWeight={'bold'} sx={{ marginX: '0.3rem', color: colors.grey[100] }}>
                    ({priceKWH} € / kwh)
                  </Typography>
                </Typography>
                <Typography
                  variant='h1'
                  fontWeight='bold'
                  sx={{ color: colors.grey[100], textWrap: 'nowrap' }}
                >
                  {savePrice} €
                </Typography>
              </Box>
            </Box>
          </Grid>}
        </Grid>
      </Box>

    </Box >
  )
}