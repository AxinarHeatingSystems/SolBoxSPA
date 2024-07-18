import React, { useEffect, useState } from 'react';
import { useTheme, Box, Button, Grid, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, CircularProgress } from "@mui/material";
import LanIcon from '@mui/icons-material/Lan';
import { getAllUsers, loadSharedUsersApi, removeSharedUserApi } from '../../axios/ApiProvider';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import { shareDeviceApi } from '../../axios/ApiProvider';

const tableCellStyle = { fontWeight: 'bold', fontSize: '0.9rem' }

export const ShareBoards = ({ devMetaData }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const colors = tokens(theme.palette.mode);
  const userData = useSelector(store => store.userData)
  const [shareTabloading, setShareTabloading] = useState(true);
  const [availableEmails, setAvailableEmails] = useState([]);
  const [shareEmail, setShareEmail] = useState();
  const [shareEmailErr, setShareEmailErr] = useState(false); 
  const [errorTxt, setErrorTxt] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleteId, setDeleteId] = useState();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    loadAllUsers();
    loadSharedUsers()
  }, [])
  const loadSharedUsers = async () => {
    if (devMetaData.attributes.devOwner === userData.id) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
    const resData = await loadSharedUsersApi({ id: devMetaData.id });
    console.log(resData);
    if (resData.state !== 'success') return;
    settingSharedUser(resData.data)
    setShareTabloading(false);
  }
  const settingSharedUser = (arrData) => {
    const tmpArr = [];
    arrData.map(dataItem => {
      if (dataItem.id !== userData.id) {
        tmpArr.push(dataItem);
      }
    });
    console.log(tmpArr);
    setSharedUsers(tmpArr);
  }
  const loadAllUsers = async () => {
    const allUsers = await getAllUsers();
    console.log('getAllUsers', allUsers);
    const emailList = [];
    allUsers.data.map(userItem => {
      emailList.push({ email: userItem.email, id: userItem.id });
    })
    setAvailableEmails(emailList)
  }

  const onShareEmailChange = (e) => {
    setShareEmail(e.target.value);
    console.log('valid', e.target.validity)
    if (e.target.validity.valid) {
      setShareEmailErr(false);
    } else {
      setShareEmailErr(true);
    }
  }

  const onShareSubmit = async (e) => {
    setIsSharing(true);
    e.preventDefault();
    console.log('shareSubmit', e);
    const emailAble = availableEmails.find(emailItem => emailItem.email === shareEmail);
    if (emailAble) {
      console.log('shareing Dev', userData, emailAble, devMetaData);
      const isResharing = sharedUsers.find(userItem => userItem.email === shareEmail);
      if (!isResharing) {
        if (userData.email !== shareEmail) {
          const sharedRes = await shareDeviceApi({ userId: emailAble.id, devId: devMetaData.id });
          let sharedlist = [];
          sharedRes.data.map(sharedItem => {
            if (sharedItem.id !== userData.id) {
              sharedlist.push(sharedItem);
            }
          })
          console.log('sharedlist', sharedlist);
          setSharedUsers(sharedlist);
          setIsSharing(false);
        } else {
          setErrorTxt(t('Email is wrong'))
          setShareEmailErr(true);
          setIsSharing(false);
        }
      } else {
        setErrorTxt(t('You can not reshare it'))
        setShareEmailErr(true);
        setIsSharing(false);
      }

    } else {
      setErrorTxt(t('user_not_exist'))
      setShareEmailErr(true);
      setIsSharing(false);
    }
  }

  const onRemoveSharedUser = async (userData) => {
    setDeleteId(userData.id);
    const removedRes = await removeSharedUserApi({ userId: userData.id, devId: devMetaData.id });
    console.log(removedRes);
    if (removedRes.state !== 'success') { setDeleteId(''); return; }

    settingSharedUser(removedRes.data);
    setDeleteId('');
  }

  return (
    <Box width={"100%"} padding={3}>
      <Box
        width={'100%'}
        height={'auto'}
        position={'relative'}
        backgroundColor={colors.primary[400]}
        padding={4}
        zIndex={0}
      >
        {isOwner && <Box>
          <Grid component={'form'} onSubmit={onShareSubmit} container spacing={3}>
            <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <LanIcon fontSize="large" color='success' />

              <Button disabled={isSharing} type='submit' variant='contained' sx={{ paddingX: '30px', fontWeight: 'bold' }} color='success'>
                {isSharing ? <CircularProgress size={20} /> : t('share_device')}
              </Button>
            </Grid>
            <Grid item xs={12} >
              <TextField type="email" fullWidth id="outlined-basic" label={t('email')}
                variant="outlined" required onChange={onShareEmailChange} value={shareEmail}
                error={shareEmailErr} helperText={shareEmailErr ? errorTxt : ""}
              />
            </Grid>
          </Grid>
        </Box>}
        <Box sx={{ position: 'relative' }} paddingTop={2}>
          <Typography variant='h4' marginBottom={2}>{t('shared_users')}</Typography>
          <TableContainer component={Paper} sx={{ position: 'relative', backgroundColor: 'transparent' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('email')}</TableCell>
                  <TableCell>{t('first_name')}</TableCell>
                  <TableCell>{t('first_name')}</TableCell>
                  {isOwner && <TableCell align="right">{t('action')}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {sharedUsers.map((userItem, key) => (
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={tableCellStyle}>
                      {userItem.email} {userItem.id === devMetaData.attributes.devOwner && <span>(Owner)</span>}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={tableCellStyle}>
                      {userItem.firstName}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={tableCellStyle} >
                      {userItem.lastName}
                    </TableCell>
                    {isOwner && <TableCell align="right">
                      <Button disabled={isDeleteId === userItem.id} variant='contained' onClick={() => onRemoveSharedUser(userItem)} size='small'>
                        {isDeleteId === userItem.id ? <CircularProgress size={20} /> : t('delete')}
                      </Button>
                    </TableCell>}
                  </TableRow>
                ))}

              </TableBody>
            </Table>
            {shareTabloading && <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={30} color='success' />
            </Box>}
          </TableContainer>

        </Box>

      </Box>

    </Box>
  )
}