import React, { useState, useContext, useEffect } from 'react';
import { Box, IconButton, Grid, useTheme } from "@mui/material";

import { ColorModeContext, tokens } from "../../theme";
import './dashboard.css'
import './loading.css'

import InsightsIcon from '@mui/icons-material/Insights';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanIcon from '@mui/icons-material/Lan';

import Header from "../../components/Header";
import StatBox from "../../components/StatBox";


import { StatusBoards } from '../../components/DashBoards/statusBoards';
import { SettingBoards } from '../../components/DashBoards/settingBoard';
import { ScheduleBoards } from '../../components/DashBoards/scheduleBoard';
import { ShareBoards } from '../../components/DashBoards/shareBoard';
import Sidebar from '../global/Sidebar';
import { getDeviceMessage, devConnection } from '../../axios/ApiProvider';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import io from "socket.io-client";
import { useSelector } from 'react-redux';

const EndPoint = process.env.REACT_APP_BASE_BACKEND_URL;
let socket;

const Dashboard = () => {

  const isMobileDetect = useSelector(store => store.isMobileDetect);
  const isPortrait = useSelector(store => store.isPortrait);

  const [isSidebar, setIsSidebar] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [submenuId, setSubmenuId] = useState(1);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [devInfo, setDevInfo] = useState(null);
  // const devId = '08B61F971EAC'
  const devId = '08F9E0E18FF4'

  useEffect(() => {

    setIsSidebar(!isMobileDetect);
  }, [isMobileDetect])

  useEffect(() => {
    console.log('isPortrait', isPortrait);
    window.scrollTo(0, 1);

    socket = io(EndPoint);
    setIsSidebar(true);

    socket.emit('join', { devId }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on('DevSubscribed', message => {

      console.log('DevSubscribed', message);
    });

    socket.on('message', message => {
      const devInfoData = JSON.parse(message);
      if (devId == devInfoData.DeviceID) {
        // console.log(devInfoData)
        setDevInfo(devInfoData)
        setDeviceId(devInfoData.DeviceID)
        setDeviceName(devInfoData.DeviceName)
      }
    });

    socket.on('devControl', error => {
      console.log('Dev Controlled', error);
    })

    // loadDevData();
  }, [])

  const subMenuClicked = (menuId) => {
    setSubmenuId(menuId);
  }

  return (
    <main className='content' style={{ display: isMobileDetect ? 'block' : 'flex' }}>
      {isSidebar && <Sidebar isMobile={isMobileDetect} isPortrait={isPortrait} isSidebar={isSidebar} deviceName={deviceName} deviceId={deviceId} />}
      <Box width={'100%'}>
        {!isPortrait &&
          <Box display={'flex'} flexGrow={1} >
            {devInfo && <>
              <Box maxWidth={'10vw'} >
                <Grid container direction={'column'} width={'10vw'}>
                  <Grid item xs={12} sx={{ maxWidth: '10vw !important' }} >
                    <Box
                      onClick={() => { subMenuClicked(1) }}
                      backgroundColor={isMobileDetect && submenuId === 1 ? colors.primary[300] : colors.primary[400]}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingY={2}
                      sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                    >
                      <StatBox
                        isSelected={submenuId === 1}
                        isMobile={isMobileDetect}
                        title="Status"
                        subtitle=""
                        progress="0.75"
                        increase=""
                        icon={
                          <InsightsIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ maxWidth: '10vw !important' }} >
                    <Box
                      onClick={() => { subMenuClicked(2) }}
                      gridColumn="span 3"
                      backgroundColor={isMobileDetect && submenuId === 2 ? colors.primary[300] : colors.primary[400]}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingY={2}
                      sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                    >
                      <StatBox
                        isSelected={submenuId === 2}
                        isMobile={isMobileDetect}
                        title="Setting"
                        subtitle=""
                        progress="0.50"
                        increase=""
                        icon={
                          <SettingsSuggestIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ maxWidth: '10vw !important' }} >
                    <Box
                      onClick={() => { subMenuClicked(3) }}
                      gridColumn="span 3"
                      backgroundColor={isMobileDetect && submenuId === 3 ? colors.primary[300] : colors.primary[400]}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingY={2}
                      sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                    >
                      <StatBox
                        isSelected={submenuId === 3}
                        isMobile={isMobileDetect}
                        title="Schedule"
                        subtitle=""
                        progress="0.30"
                        increase=""
                        icon={
                          <CalendarMonthIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ maxWidth: '10vw !important' }} >
                    <Box
                      onClick={() => { subMenuClicked(4) }}
                      gridColumn="span 3"
                      backgroundColor={isMobileDetect && submenuId === 4 ? colors.primary[300] : colors.primary[400]}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingY={2}
                      sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                    >
                      <StatBox
                        isSelected={submenuId === 4}
                        isMobile={isMobileDetect}
                        title="Share Device"
                        subtitle=""
                        progress="0.80"
                        increase=""
                        icon={
                          <LanIcon
                            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box maxWidth={'90vw'} height={'80vh'} position={'relative'}>
                {submenuId === 1 && <StatusBoards isMobile={isMobileDetect} isPortrait={isPortrait} devData={devInfo} socketIo={socket} />}
                {submenuId === 2 && <SettingBoards />}
                {submenuId === 3 && <ScheduleBoards />}
                {submenuId === 4 && <ShareBoards />}
              </Box>
            </>}

          </Box>
        }
        {isPortrait &&
          <Box flexGrow={1}>
        {devInfo && <Box m="20px">
          {/* HEADER */}
              <Box className="header-bar">
                <Grid container spacing={2} marginBottom={isMobileDetect ? 0 : 2} alignItems={'baseline'}>
                  {!isMobileDetect && <Grid item md={4} xs={12}>
                    <Header isMobile={isMobileDetect} title={devInfo.DeviceName} subtitle={devInfo.DeviceID} />
              </Grid>}
                  <Grid item md={8} xs={12} sx={isMobileDetect ? { paddingTop: '0px !important' } : {}}>
                <Box>
                      <Grid container spacing={isMobileDetect ? 0 : 2} marginBottom={isMobileDetect ? 0 : 2}>
                    <Grid item xs={3}>
                      <Box
                        onClick={() => { subMenuClicked(1) }}
                        gridColumn="span 3"
                            backgroundColor={isMobileDetect && submenuId === 1 ? colors.primary[300] : colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        paddingY={2}
                        sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                      >
                        <StatBox
                          isSelected={submenuId === 1}
                              isMobile={isMobileDetect}
                              isPortrait={isPortrait}
                          title="Status"
                          subtitle=""
                          progress="0.75"
                          increase=""
                          icon={
                            <InsightsIcon
                              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        onClick={() => { subMenuClicked(2) }}
                        gridColumn="span 3"
                            backgroundColor={isMobileDetect && submenuId === 2 ? colors.primary[300] : colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        paddingY={2}
                        sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                      >
                        <StatBox
                          isSelected={submenuId === 2}
                              isMobile={isMobileDetect}
                              isPortrait={isPortrait}
                          title="Setting"
                          subtitle=""
                          progress="0.50"
                          increase=""
                          icon={
                            <SettingsSuggestIcon
                              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        onClick={() => { subMenuClicked(3) }}
                        gridColumn="span 3"
                            backgroundColor={isMobileDetect && submenuId === 3 ? colors.primary[300] : colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        paddingY={2}
                        sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                      >
                        <StatBox
                          isSelected={submenuId === 3}
                              isMobile={isMobileDetect}
                              isPortrait={isPortrait}
                          title="Schedule"
                          subtitle=""
                          progress="0.30"
                          increase=""
                          icon={
                            <CalendarMonthIcon
                              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        onClick={() => { subMenuClicked(4) }}
                        gridColumn="span 3"
                            backgroundColor={isMobileDetect && submenuId === 4 ? colors.primary[300] : colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        paddingY={2}
                        sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px' }}
                      >
                        <StatBox
                          isSelected={submenuId === 4}
                              isMobile={isMobileDetect}
                              isPortrait={isPortrait}
                          title="Share Device"
                          subtitle=""
                          progress="0.80"
                          increase=""
                          icon={
                            <LanIcon
                              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
              {submenuId === 1 && <StatusBoards isMobile={isMobileDetect} isPortrait={isPortrait} devData={devInfo} socketIo={socket} />}
          {submenuId === 2 && <SettingBoards />}
          {submenuId === 3 && <ScheduleBoards />}
          {submenuId === 4 && <ShareBoards />}

          {/* GRID & CHARTS */}

          {/* ------------------------------------------------------ */}

        </Box>}

          </Box>
        }
        {!devInfo &&
          <Box className="loading-pannel">
            <div className="pl">
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__dot"></div>
              <div className="pl__text">Loading…</div>
            </div>
          </Box>
        }
      </Box>


    </main>

  );
};

export default Dashboard;
