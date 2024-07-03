import React, { useState, useContext, useEffect } from 'react';
import { ProSidebar } from "react-pro-sidebar";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";

import iotLogo from '../../assets/iotLogo.svg'
import { ColorModeContext, tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ClearIcon from '@mui/icons-material/Clear';
import { logoutApi } from '../../axios/ApiProvider';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isMobile, isPortrait, deviceName, deviceId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsCollapsed(!isCollapsed);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = (e) => {
      if (e.target.innerWidth < 1024) {
        setIsCollapsed(true);
      }
      // Perform actions on window resize
      console.log('screen Resizing', e);
    };
    const handlePointer = (e) => {
      console.log('eventClick', e);
      // setIsCollapsed(false)
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handlePointer);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handlePointer);
    };
  }, []);

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
  const onLogOut = () => {
    logoutApi()
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
            SolBox Control Panel {isMobile && !isPortrait && <Typography variant='body1' marginX={1}>( <b>{deviceName}</b> - {deviceId})</Typography>}
          </Typography>
          <IconButton onClick={handleClick}>
            {isCollapsed && <ClearIcon />}
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
            Theme
          </Typography>
          <MenuItem onClick={() => { colorMode.toggleColorMode(); handleClose(); }} sx={{ width: '100vw' }}>
            <ListItemIcon>
              {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {theme.palette.mode === "dark" ? 'Dark Mode' : 'Light Mode'}
            </ListItemText>
          </MenuItem>
          <Divider />
          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Devices
          </Typography>
          <MenuItem selected={selected === 'dashboard'} onClick={() => { setSelected('dashboard'); handleClose() }}
            sx={{ width: '100vw' }}>
            <ListItemIcon>
              <HomeOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Device 1</ListItemText>
          </MenuItem>
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
                SolBox Control Panel {isMobile && !isPortrait && <Typography variant='body1' marginX={1}>( <b>{deviceName}</b> - {deviceId})</Typography>}
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
                <Typography variant='h5' fontWeight={700} textAlign={'center'}>Join User</Typography>
              </Box>}
              <Box display={'flex'} justifyContent={isCollapsed ? 'center' : 'space-between'} alignItems={'center'} flexWrap={'wrap'}>
                <Button variant="outlined" color='success' sx={{ marginY: '10px' }} size={!isCollapsed ? "medium" : "small"}>
                  {!isCollapsed ? 'Setting' : <ManageAccountsIcon />}
                </Button>
                <Button onClick={() => { onLogOut() }} variant="outlined" color='secondary' sx={{ marginY: '10px' }} size={!isCollapsed ? "medium" : "small"}>
                  {!isCollapsed ? 'Log Out' : <LogoutIcon />}
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
            Theme
          </Typography>
          <ListItemButton onClick={() => { colorMode.toggleColorMode() }}>
            <ListItemIcon sx={{ justifyContent: 'center' }}>
              {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={theme.palette.mode === "dark" ? 'Dark Mode' : 'Light Mode'} />}
          </ListItemButton>
          <Divider />
          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Devices
          </Typography>
          <ListItemButton
            selected={selected === 'dashboard'}
            onClick={() => { setSelected('dashboard') }}
          >
            <ListItemIcon sx={{ justifyContent: 'center' }}>
              <HomeOutlinedIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Device 1" />}
          </ListItemButton>
        </List>
      </ProSidebar>}
    </Box>
  );
};

export default Sidebar;