import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography, useTheme } from "@mui/material"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { BsSunriseFill, BsSunsetFill } from "react-icons/bs";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { CiTempHigh } from "react-icons/ci";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { devInfoData_Store, devMetaData_Store } from "../../store/actions/mainAction";
import { tokens } from "../../theme";

export const DeviceMenuItem = ({ isMobile, isCollapsed, deviceInfo, userId, selectedId, onSelectDevId, onRemoveDevice, socketIo }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isConnected, setIsConnected] = useState(false);
  const [socketCounter, setSocketCounter] = useState(0);
  const [prevCounter, setPrevCounter] = useState(0);
  const [devInfoItem, setDevInfoItem] = useState(null);

  useEffect(() => {
    if (selectedId == deviceInfo.id) {
      dispatch(devMetaData_Store(deviceInfo));
    }
  }, selectedId)
  useEffect(() => {
    console.log('clickedJOIN');
    const devId = deviceInfo.name;
    socketIo.emit('join', { devId }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [])

  useEffect(() => {
    const interVal = setInterval(() => {
      // console.log('checkPrevCounter', deviceInfo.name, socketCounter, prevCounter)
      if (prevCounter < socketCounter) {
        setPrevCounter(socketCounter);
      } else {
        if (selectedId === deviceInfo.id) {
          // console.log(selectedId, deviceInfo)
          dispatch(devInfoData_Store(null));
        }
        setIsConnected(false);
      }
    }, 1000)
    return () => clearInterval(interVal)
  }, [prevCounter, socketCounter, selectedId])

  useEffect(() => {
    const subScribTopic = `axinar/solbox/${deviceInfo.name}/jsonTelemetry`
    socketIo.on(subScribTopic, message => {
      // console.log('checkMessage', subScribTopic)
      setIsConnected(true);
      saveDevInfoData(message)
      setSocketCounter(prev => prev + 1);
    })
    return () => {
      socketIo.off(subScribTopic);
    }
  }, [socketIo, socketCounter])
  const saveDevInfoData = (message) => {
    const devInfoData = JSON.parse(message);
    setDevInfoItem(devInfoData);
    if (selectedId == deviceInfo.id) {
      // console.log('Dev Info Changed', selectedId, devInfoItem)
      dispatch(devInfoData_Store(devInfoItem));
    }

  }
  return (
    <ListItem
      selected={selectedId === deviceInfo.id}
      sx={{ display: isMobile ? 'flex' : isCollapsed ? 'block' : 'flex' }}
    >
      <ListItemButton sx={{ padding: '0px' }} onClick={() => { onSelectDevId(deviceInfo) }}>
        {!isCollapsed && <HomeOutlinedIcon sx={{ marginX: 0.5 }} />}
        <Box>
          <Box display={'flex'}>
            <Typography variant="h5" fontWeight={'bold'} textAlign={"start"}>{deviceInfo.DeviceName}</Typography>
          </Box>
          <Stack direction={"row"} spacing={1} justifyContent={'flex-start'} alignItems={"center"}>
            <GiSunrise color={colors.grey[100]} /> <span>xx:xx</span>
            <GiSunset color={colors.grey[100]} /> <span>xx:xx</span>
            <CiTempHigh color={colors.grey[100]} /> <span>xx:xx</span>
          </Stack>
        </Box>

      </ListItemButton>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
        {deviceInfo.attributes?.devOwner === userId && < IconButton onClick={() => { onRemoveDevice(deviceInfo) }} sx={{ padding: 0 }}>
          <DeleteForeverIcon color='error' />
        </IconButton>}
        <LightbulbIcon color={isConnected ? 'success' : 'error'} />
      </Box>
    </ListItem>
  )
}