import React, { useState, useContext, useEffect } from 'react';
import { ProSidebar } from "react-pro-sidebar";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Swal from "sweetalert2";
// import io from "socket.io-client";

import { Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "react-pro-sidebar/dist/css/styles.css";

import iotLogo from '../../assets/iotLogo.svg'
import { ColorModeContext, tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { getUserDeviceListApi, getDevicesApi, logoutApi } from '../../axios/ApiProvider';
import { useSelector } from 'react-redux';
import { SetLang } from '../../components/Language/SetLang';
import { useTranslation } from 'react-i18next';
import { AddDevModal } from './AddDevModal';

// const EndPoint = process.env.REACT_APP_BASE_BACKEND_URL;
const Sidebar = ({ isMobile, isPortrait, deviceName, deviceId, onChangeDevId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState();
  const userData = useSelector(store => store.userData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddDev, setIsAddDev] = useState(false);
  const [pairingData, setPairingData] = useState();
  const [devList, setDevList] = useState([]);
  const open = Boolean(anchorEl);

  const desktopStyle = {
    "& .pro-sidebar": {
      position: 'relative'
    },
    "& .pro-sidebar-inner": {
      background: `${colors.primary[400]} !important`,
    },
    "& .pro-icon-wrapper": {
      backgroundColor: "transparent !important",
    },
    "& .pro-inner-item": {
      padding: "5px 35px 5px 20px !important",
    },
    "& .pro-inner-item:hover": {
      color: "#868dfb !important",
    },
    "& .pro-menu-item.active": {
      color: "#6870fa !important",
    },
  }

  const mobileStyle = {
    width: '100%',
    boxShadow: 'inset 0px -7px 4px -8px',
    '& .pro-menu ul': {
      paddingInlineStart: '0px',
      listStyleType: 'none',
    },
    '& .pro-menu .mobileMenu-list': {
      position: 'absolute',
      width: '100%',
      boxShadow: 'inset 0px -2px 2px 0px',
      top: '49px',
      zIndex: 10,
    },
    '& .pro-menu .mobileMenu-list .pro-inner-item': {
      display: 'flex',
      padding: "5px 35px 5px 20px !important",
      alignItems: 'center',

    },
    "& .pro-inner-item:hover": {
      color: "#868dfb !important",
    },
    "& .pro-menu-item.active": {
      color: "#6870fa !important",
    },
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsCollapsed(!isCollapsed);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    loadDevlist();
    console.log('useData', userData);
    const handleResize = (e) => {
      if (e.target.innerWidth < 1024) {
        setIsCollapsed(true);
      }
      // Perform actions on window resize
      console.log('screen Resizing', e);
    };
    // const handlePointer = (e) => {
    //   console.log('eventClick', e);
    //   // setIsCollapsed(false)
    // }
    window.addEventListener('resize', handleResize);
    // window.addEventListener('click', handlePointer);
    return () => {
      window.removeEventListener('resize', handleResize);
      // window.removeEventListener('click', handlePointer);
    };
  }, []);

  const loadDevlist = async () => {
    const userDevs = await getUserDeviceListApi();
    console.log(userDevs);
    if (userDevs.state !== 'success') return;
    if (userDevs.data.length > 0) {
      if (!selected) {
        onSelectDevId(userDevs.data[0]);
      }
      setDevList(userDevs.data);

    } else {
      handelAddDevOpen();
    }

  }

  const onSelectDevId = (devData) => {
    onChangeDevId(devData)
    setSelected(devData)
  }


  const onLogOut = () => {
    logoutApi()
  }

  const handleAddDevClose = () => {
    setIsAddDev(false);
    loadDevlist();
  }
  const handelAddDevOpen = async () => {
    Swal.fire({
      title: t('searching_your_device'),
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      inputPlaceholder: t('feel_devid_paircode'),
      showCancelButton: false,
      confirmButtonText: t('search'),
      showLoaderOnConfirm: true,
      preConfirm: async (inputVal) => {
        if (inputVal) {
          console.log(inputVal);
          const allDevs = await getDevicesApi();
          console.log(allDevs);
          const devsArr = allDevs.data.data;
          let isPaired = false;
          let paringData = {};
          devsArr.map(devItem => {
            console.log(devItem.clientid, parseInt(devItem.clientid, 16));
            const hexVal = parseInt(devItem.clientid, 16);
            const hexStr = hexVal.toString();
            const pairingNum = hexStr.slice(hexStr.length - 6, hexStr.length);
            if (devItem.clientid === inputVal) {
              isPaired = true;
              paringData = {
                deviceId: devItem.clientid,
                pairingCode: pairingNum
              }
              return;
            } else if (pairingNum === inputVal) {
              // if (pairingNum === inputVal) {
              isPaired = true;
              paringData = {
                deviceId: devItem.clientid,
                pairingCode: pairingNum
              }
              return;
              // }
            }

          })
          if (isPaired) {
            return paringData;
          } else {
            Swal.showValidationMessage(`
              ${t('pairing_failed')}
            `);
          }
        } else {
          Swal.showValidationMessage(`
            ${t('please_feel_input')}
          `);
        }

      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        setPairingData(result.value);
        setIsAddDev(true);
      }
    });
    // await Swal.fire({
    //   customClass: {
    //     container: 'devParingContainer',
    //     popup: 'devParingPopup',
    //   },
    //   title: t('searching_your_device'),
    //   html: `
    //     <div class="swal2-formControl">
    //       <label class="swal2-label">${t('device_id')}</label>
    //       <input type="text" name="deviceId" id="swal-input1" class="swal2-input" >
    //     </div>
    //     <div class="swal2-formControl">
    //       <label class="swal2-label">${t('pairing_code')}</label>
    //       <input type="text" name="pairingCode" id="swal-input2" class="swal2-input">
    //     </div>
    //   `,
    //   preConfirm: async () => {
    //     const devId = document.getElementById("swal-input1").value;
    //     const pairCode = document.getElementById("swal-input2").value;

    //     if (devId && pairCode) {
    //       const searchSocket = io(EndPoint);
    //       const allDevs = await getDevicesApi();
    //       if (isChecked) {
    //         return {
    //           deviceId: devId,
    //           pairingCode: pairCode
    //         };
    //       } else {
    //         if (allDevs.state === 'success') {
    //           let loadedDevInfo = null;
    //           const devsArr = allDevs.data.data;
    //           const existDev = devsArr.find(item => item.clientid === devId);
    //           console.log('existDev', existDev);
    //           if (existDev) {
    //             const searchTopic = `axinar/solbox/${devId}/jsonTelemetry`;

    //             searchSocket.emit('join', { devId }, (error) => {
    //               if (error) {
    //                 alert(error);
    //               }
    //             });
    //             await searchSocket.on(searchTopic, message => {
    //               console.log(message);
    //               loadedDevInfo = JSON.parse(message);
    //               console.log(loadedDevInfo);
    //               searchSocket.off(searchTopic);
    //               if (loadedDevInfo.pairing[1] === pairCode) {
    //                 console.log('confirmed')

    //                 isChecked = true;
    //                 Swal.clickConfirm();
    //                 return {
    //                   deviceId: devId,
    //                   pairingCode: pairCode
    //                 };
    //               } else {
    //                 console.log('PLPLPLPLPL')
    //                 Swal.showValidationMessage(`
    //                   Paring Failed
    //                 `);
    //               }

    //             });
    //             console.log('checking');
    //             Swal.showValidationMessage(`
    //               Please wait
    //             `);
    //             Swal.showLoading();
    //             setTimeout(() => {
    //               Swal.showValidationMessage(`
    //                 Paring Failed
    //               `);
    //             }, 1000)
    //           } else {
    //             Swal.showValidationMessage(`
    //               There is not the device
    //             `);
    //           }
    //         } else {
    //           Swal.showValidationMessage(`
    //             There is not the device
    //           `);
    //         }
    //       }

    //     } else {
    //       Swal.showValidationMessage(`
    //         Please feel the Device Id and Pairing Code fields
    //       `);
    //     }
    //   }
    // }).then(result => {
    //   console.log('checking result', result);
    //   if (result.isConfirmed) {
    //     setPairingData(result.value);
    //     setIsAddDev(true);
    //   }
    // });

  }

  return (
    <Box
      sx={isMobile ? mobileStyle : desktopStyle}
    >
      {isMobile && <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mx="15px"
          mt={'10px'}
        >
          <Typography variant="h3" display={'flex'} alignItems={'baseline'} color={colors.grey[100]}>
            {t("title")} {isMobile && !isPortrait && <Typography variant='body1' marginX={1}>( <b>{deviceName}</b> - {selected.name})</Typography>}
          </Typography>
          <IconButton onClick={handleClick}>
            {isCollapsed && <MenuOutlinedIcon />}
            {!isCollapsed && <MenuOutlinedIcon />}
          </IconButton>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ width: '100%', color: colors.grey[100] }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            'style': { backgroundColor: theme.palette.background.default }
          }}
        >
          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {t("language")}
          </Typography>
          <MenuItem >
            <div style={{ width: '100%', height: '30px' }} >
              <SetLang />
            </div>

          </MenuItem>
          <Divider />
          <Typography color={colors.grey[300]} sx={{ m: "15px 0 5px 10px" }} variant='h5' fontWeight={700} textAlign={'start'} display={'flex'} justifyContent={'start'} alignItems={'center'}>
            <AccountCircleIcon marginX={2} /> {userData.firstName} {userData.lastName}
          </Typography>
          <MenuItem >
            <ListItemIcon>
              <ManageAccountsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("setting")}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onLogOut(); handleClose(); }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("logout")}</ListItemText>
          </MenuItem>
          <Divider />
          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {t("theme")}
          </Typography>
          <MenuItem onClick={() => { colorMode.toggleColorMode(); handleClose(); }} sx={{ width: '100vw' }}>
            <ListItemIcon>
              {theme.palette.mode === "dark" ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {theme.palette.mode === "dark" ? t("light_mode") : t("dark_mode")}
            </ListItemText>
          </MenuItem>
          <Divider />
          <ListItem sx={{ padding: '5px 0px' }}>
            <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                {t("devices")}
              </Typography>
              <Button size='small' color='success' onClick={() => { handelAddDevOpen() }}>
                + {t("add")}
              </Button>
            </Box>
          </ListItem>
          {devList.map((devItem, key) => (
            <MenuItem key={key} selected={selected.id === devItem.id} onClick={() => { onSelectDevId(devItem); handleClose() }}
              sx={{ width: '100vw' }}>
              <ListItemIcon>
                <HomeOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{devItem.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>}
      {!isMobile && <ProSidebar collapsed={isCollapsed} style={{ minHeight: '100vh' }}>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem>
            <Box
              display="flex"
              justifyContent={isCollapsed ? "center" : "space-between"}
              alignItems="center"
              mt={'10px'}
              width={'100%'}
            >
              {!isCollapsed && <Typography variant="h4" display={'flex'} alignItems={'baseline'} color={colors.grey[100]}>
                {t("title")} {isMobile && !isPortrait && <Typography variant='body1' marginX={1}>( <b>{deviceName}</b> - {selected.name})</Typography>}
              </Typography>}
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed && <MenuOutlinedIcon />}
                {!isCollapsed && <MenuOutlinedIcon />}
              </IconButton>
            </Box>
          </ListItem>
          <Divider />
          <ListItem>
            <Box width={'100%'} marginY={1}>
              <Box display="flex" justifyContent="center" alignItems="center"
                style={{ cursor: "pointer", width: '100%' }}
              >
                <img
                  alt="profile-user"
                  width={!isCollapsed ? "100px" : "50px"}
                  height={!isCollapsed ? "100px" : "50px"}
                  src={iotLogo}
                  style={{ cursor: "pointer", border: '1px solid', borderRadius: '50%' }}
                />
              </Box>
              {!isCollapsed && <Box marginY={1}>
                <Typography variant='h5' fontWeight={700} textAlign={'center'}>{userData.firstName} {userData.lastName}</Typography>
              </Box>}
              <Box display={'flex'} justifyContent={isCollapsed ? 'center' : 'space-between'} alignItems={'center'} flexWrap={'wrap'}>
                <Button variant="outlined" color='success' sx={{ marginY: '10px' }} size={!isCollapsed ? "medium" : "small"}>
                  {!isCollapsed ? t("setting") : <ManageAccountsIcon />}
                </Button>
                <Button onClick={() => { onLogOut() }} variant="outlined" color='secondary' sx={{ marginY: '10px' }} size={!isCollapsed ? "medium" : "small"}>
                  {!isCollapsed ? t("logout") : <LogoutIcon />}
                </Button>
              </Box>
            </Box>
          </ListItem>
          <Divider />
          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {t("language")}
          </Typography>
          <MenuItem >
            <SetLang />
          </MenuItem>
          <Divider />
          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            {t("theme")}
          </Typography>
          {!isCollapsed &&
            <ListItemButton onClick={() => { colorMode.toggleColorMode() }}>
              <ListItemIcon sx={{ justifyContent: 'center' }}>
                {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </ListItemIcon>
              <ListItemText primary={theme.palette.mode === "dark" ? t("light_mode") : t("dark_mode")} />
            </ListItemButton>
          }
          {isCollapsed &&
            <ListItemButton onClick={() => { colorMode.toggleColorMode() }}>
              <ListItemIcon sx={{ justifyContent: 'center' }}>
                {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </ListItemIcon>
            </ListItemButton>
          }
          <Divider />
          <ListItem sx={{ padding: '5px 0px' }}>
            <Box width={'100%'} display={isCollapsed ? 'block' : 'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                {t("devices")}
              </Typography>
              <Button size='small' color='success' onClick={() => { handelAddDevOpen() }}>
                + {t("add")} 
              </Button>
            </Box>
          </ListItem>

          {devList.map((devItem, key) => (
            <ListItemButton
              key={key}
              selected={selected.id === devItem.id}
              onClick={() => { onSelectDevId(devItem) }}
            >
              <ListItemIcon sx={{ justifyContent: 'center' }}>
                <HomeOutlinedIcon />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={devItem.name} />}
              <LightbulbIcon color={devItem.connected ? 'success' : 'primary'} />

            </ListItemButton>
          ))}
        </List>
      </ProSidebar>}
      <AddDevModal isAddDev={isAddDev} onClose={handleAddDevClose} pairingData={pairingData} />

    </Box>
  );
};

export default Sidebar;