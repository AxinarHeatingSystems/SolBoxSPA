import React, { useState, useContext, useEffect } from 'react';
import { ProSidebar } from "react-pro-sidebar";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Swal from "sweetalert2";

import { Alert, Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, TextField, Typography, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LogoutIcon from '@mui/icons-material/Logout';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "react-pro-sidebar/dist/css/styles.css";

import iotLogo from '../../assets/iotLogo.svg'
import { ColorModeContext, tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { getUserDeviceListApi, getDevicesApi, logoutApi, getAllDevsApi, getRemoveDeviceApi } from '../../axios/ApiProvider';
import { useSelector } from 'react-redux';
import { SetLang } from '../../components/Language/SetLang';
import { useTranslation } from 'react-i18next';
import { AddDevModal } from './AddDevModal';
import axios from 'axios';

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
  const [ipAddress, setIpAddress] = useState('')
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90vw' : 600,
    bgcolor: theme.palette.background.default,
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [isSearchUI, setIsSearchUI] = useState(false);
  const [pairableDevs, setPairableDevs] = useState([]);
  const [findingPairable, setFindingPairable] = useState(true);
  const [pairingCode, setPairingCode] = useState();
  const [pairingCodeError, setPairingCodeError] = useState(false);
  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log("ipData", res.data);
    setIpAddress(res.data.ip);
  };

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
    getData();
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
    console.log('userDevs', userDevs);
    if (userDevs.state !== 'success') return;
    if (userDevs.data.length > 0) {
      const devArr = parsingDeviceData(userDevs.data);
      if (!selected) {
        onSelectDevId(devArr[0]);
      } else {
        const isExistSelected = devArr.find(devArrItem => devArrItem.id === selected.id)
        if (!isExistSelected) {
          onSelectDevId(devArr[0]);
        }
      }
      setDevList(devArr);
      console.log(devArr);

    } else {
      handleSearchDevOpen();
    }
  }

  const parsingDeviceData = (devList) => {
    let devArr = [];
    devList.map(devItem => {
      const attrKeys = Object.keys(devItem.attributes);
      if (attrKeys.find(keyItem => keyItem === 'DeviceName')) {
        devItem.DeviceName = devItem.attributes['DeviceName'][0];
      } else {
        devItem.DeviceName = devItem.name
      }
      attrKeys.map(keyItem => devItem.attributes[keyItem] = devItem.attributes[keyItem][0])
      devArr.push(devItem);
    })
    return devArr;
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
  const handleSearchDevOpen = async () => {
    setFindingPairable(true);
    // setIsAddDev(true);
    setPairableDevs([]);
    setIsSearchUI(true);
    const allSavedDevRes = await getAllDevsApi();
    console.log(allSavedDevRes);
    const allSavedDevs = allSavedDevRes.data;
    const allDevs = await getDevicesApi();
    console.log(allDevs);
    const resDevs = allDevs.data.data;
    let ableDevArr = [];
    resDevs.map(devItem => {
      const existDev = allSavedDevs.find(dev => dev.name === devItem.clientid);
      // console.log('dddd', existDev, /^[0-9A-F]{12}$/i.test(devItem.clientid));
      if (existDev === undefined && /^[0-9A-F]{12}$/i.test(devItem.clientid)) {
        if (devItem.ip_address === ipAddress) {
          const hexVal = parseInt(devItem.clientid, 16);
          const hexStr = hexVal.toString();
          const pairingNum = hexStr.slice(hexStr.length - 6, hexStr.length);
          ableDevArr.push({
            deviceId: devItem.clientid,
            pairingCode: pairingNum
          })
        }
      }
    })
    setPairableDevs(ableDevArr);
    setFindingPairable(false);
    // Swal.fire({
    //   title: t('searching_your_device'),
    //   input: "text",
    //   inputAttributes: {
    //     autocapitalize: "off"
    //   },
    //   inputPlaceholder: t('feel_devid_paircode'),
    //   showCancelButton: false,
    //   confirmButtonText: t('search'),
    //   showLoaderOnConfirm: true,
    //   didOpen: async () => {
    //     Swal.isLoading()
    //     const allDevs = await getDevicesApi();
    //     console.log(allDevs);
    //   },
    //   preConfirm: async (inputVal) => {
    //     let errorTxt = 'pairing_failed';
    //     if (inputVal) {
    //       console.log(inputVal, devList);
    //       const allDevs = await getDevicesApi();
    //       console.log(allDevs);
    //       const devsArr = allDevs.data.data;
    //       let isPaired = false;
    //       let paringData = {};
    //       devsArr.map(devItem => {
    //         console.log(devItem.clientid, parseInt(devItem.clientid, 16));
    //         const hexVal = parseInt(devItem.clientid, 16);
    //         const hexStr = hexVal.toString();
    //         const pairingNum = hexStr.slice(hexStr.length - 6, hexStr.length);
    //         const existDev = devList.find(dev => dev.name === devItem.clientid);
    //         console.log('dddd', existDev);
    //         if (!existDev) {
    //           if (devItem.clientid === inputVal) {
    //             isPaired = true;
    //             paringData = {
    //               deviceId: devItem.clientid,
    //               pairingCode: pairingNum
    //             }
    //             return;
    //           } else if (pairingNum === inputVal) {
    //             // if (pairingNum === inputVal) {
    //             isPaired = true;
    //             paringData = {
    //               deviceId: devItem.clientid,
    //               pairingCode: pairingNum
    //             }
    //             return;
    //           // }
    //           }
    //         } 
    //       })
    //       if (isPaired) {
    //         return paringData;
    //       } else {
    //         Swal.showValidationMessage(`
    //           ${t(errorTxt)}
    //         `);
    //       }
    //     } else {
    //       Swal.showValidationMessage(`
    //         ${t('please_feel_input')}
    //       `);
    //     }

    //   },
    //   allowOutsideClick: () => !Swal.isLoading()
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     setPairingData(result.value);
    //     setIsAddDev(true);
    //   }
    // });

  }

  const handleSearchDevClose = () => {
    setIsSearchUI(false);
  }

  const onDevSearchFormSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
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
        const existDev = devList.find(dev => dev.name === devItem.clientid);
        console.log('dddd', existDev);
        if (!existDev) {
          if (devItem.clientid === pairingCode) {
            isPaired = true;
            paringData = {
              deviceId: devItem.clientid,
              pairingCode: pairingNum
            }
            return;
          } else if (pairingNum === pairingCode) {
            isPaired = true;
            paringData = {
              deviceId: devItem.clientid,
              pairingCode: pairingNum
            }
            return;
          }
        }
      })
      if (isPaired) {
        setPairingData(paringData);
        setIsSearchUI(false);
        setIsAddDev(true);
      } else {
        setPairingCodeError(true);
      }
    }
  }
  const handleAddDevOpen = (pairingInfo) => {
    setPairingData(pairingInfo);
    setIsSearchUI(false);
    setIsAddDev(true);
  }

  const onRemoveDevice = (devItem) => {
    Swal.fire({
      title: "Do you want to remove this Device?",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "red"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Swal.fire("Removed!", "", "success");
        console.log(devItem)
        const devInfo = { devId: devItem.id }
        const removedRes = await getRemoveDeviceApi(devInfo);
        if (removedRes.state !== 'success') return;

        loadDevlist();
      }
      /* Read more about isConfirmed, isDenied below */
      // if (result.isConfirmed) {
      //   Swal.fire("Saved!", "", "success");
      // } else if (result.isDenied) {
      //   Swal.fire("Changes are not saved", "", "info");
      // }
    });
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
            {/* <ListItemText>{t("setting")}</ListItemText> */}
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
              <Button size='small' color='success' onClick={() => { handleSearchDevOpen() }}>
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
              <ListItemText>{devItem.DeviceName}</ListItemText>
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
              <Box display={'block'} justifyContent={isCollapsed ? 'center' : 'space-between'} alignItems={'center'} flexWrap={'wrap'}>
                {/* <Button variant="outlined" color='success' sx={{ marginY: '10px' }} size={!isCollapsed ? "medium" : "small"}>
                  {!isCollapsed ? t("setting") : <ManageAccountsIcon />}
                </Button> */}
                <Button fullWidth onClick={() => { onLogOut() }} variant="outlined" color='secondary' sx={{ marginY: '10px' }} size={!isCollapsed ? "medium" : "small"}>
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
              <Button size='small' color='success' onClick={() => { handleSearchDevOpen() }}>
                + {t("add")} 
              </Button>
            </Box>
          </ListItem>

          {devList.map((devItem, key) => (
            <ListItem
              key={key}
              selected={selected.id === devItem.id}
            > 
              <ListItemButton sx={{ padding: '0px' }} onClick={() => { onSelectDevId(devItem) }}>
                <ListItemIcon sx={{ justifyContent: 'center' }}>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={devItem.DeviceName} />}
              </ListItemButton>
              <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                <IconButton onClick={() => { onRemoveDevice(devItem) }} sx={{ padding: 0 }}>
                  <DeleteForeverIcon color='error' />
                </IconButton>
                <LightbulbIcon color={devItem.connected ? 'success' : 'primary'} />
              </Box>


            </ListItem>
          ))}
        </List>
      </ProSidebar>}
      <AddDevModal isAddDev={isAddDev} onClose={handleAddDevClose} pairingData={pairingData} ipAddress={ipAddress} />

      <Modal
        open={isSearchUI}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid component={'form'} onSubmit={onDevSearchFormSubmit} container spacing={1}>
            <Grid item xs={12}>
              <Typography variant={'h4'} textAlign={'center'}>{t('search_your_device')}</Typography>
            </Grid>
            <Grid item xs={12}>
              {/* <FormControlLabel label="Search Dev"/> */}
              <TextField fullWidth variant='outlined' placeholder={t('feel_devid_paircode')}
                value={pairingCode} onChange={(e) => { setPairingCode(e.target.value) }}
                required error={pairingCodeError} helperText={pairingCodeError ? t('pairing_failed') : ''} />

            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>{t('device_list_matched_ip')}</Typography>
              {!findingPairable &&
                <>
                  {pairableDevs.length > 0 ?
                    <List sx={{ paddingY: 0 }}>
                      {pairableDevs.map((devData, key) => (
                        <ListItem key={key}>
                          <HomeOutlinedIcon />
                          <ListItemText>{devData.deviceId}</ListItemText>
                          <Button onClick={() => { handleAddDevOpen(devData) }} type='button' variant='contained' size='small' color='success'>
                            {t('pairing')}
                          </Button>
                        </ListItem>
                      ))
                      }
                    </List> 
                  :
                  <Alert severity="warning" >{t('not_device_matched_ip')}</Alert>
                }
              </>
              }
              {findingPairable && <Alert severity="info" >{t('searching_your_device')}</Alert>}
              <Divider />
            </Grid>
            <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Button variant='contained' type='button' onClick={() => { handleSearchDevClose() }} color="error">{t('cancel')}</Button>
              <Button variant='contained' type='submit' color='success'>{t('pairing')}</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default Sidebar;