
import axios from 'axios';

export const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL
export const GoogleClientID = "1095375617733-7epn0ikmfmvisfir90k57s4ih975mrh5.apps.googleusercontent.com"

const getJWTToken = () => {
  const strUser = localStorage.getItem('userData');
  const userData = JSON.parse(strUser);
  console.log('using Data', userData);
  return `Bearer ${userData.tokens}`;
}
const getUserData = () => {
  const strUser = localStorage.getItem('userData');
  const userData = JSON.parse(strUser);
  return userData;
}
export const logoutApi = async () => {
  
  localStorage.removeItem("userData");
  window.location.href = '/login';

}

export const getAllUsers = async () => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/getAllUsers`;
  const tokenData = getJWTToken();
  await axios({
    method: 'post',
    url: apiUrl,
    headers: {Authorization: tokenData}
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data.data;
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error('Users Gettting Api is wrong');
  })

  return resultState;
}

export const getDevInfoApi = async (id) => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}mqtt/getDevInfo`;
  const tokenData = getJWTToken();
  await axios({
    method: 'post',
    url: apiUrl,
    data: {id: id},
    headers: {Authorization: tokenData}
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data.data;
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error('Users Gettting Api is wrong');
  })
  return resultState;
}

export const getUserDeviceListApi = async () => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}mqtt/userDevs`;
  const tokenData = getJWTToken();
  const userData = getUserData();
  await axios({
    method: 'post',
    url: apiUrl,
    data: {userId: userData.id},
    headers: {Authorization: tokenData}
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data.data;
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error('Users Gettting Api is wrong');
  })

  return resultState;
}
export const existLogin = async (email) => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/existLogin`;
  const tokenData = getJWTToken();
  await axios({
    method: 'post',
    url: apiUrl,
    data: {useremail: email},
    headers: {Authorization: tokenData}
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data.data;
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error('Email or Password is not matched');
  })

  return resultState;
}
export const loginApi = async (loginInfo) => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/authenticate`;

  const data = {
    email: loginInfo.email,
    password: loginInfo.password
  };

  await axios({
    method: 'post',
    url: apiUrl,
    data: data
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data;
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.response.data? err.response.data.message : err.message;
    window.toastr.error('Email or Password is not matched');
  })

  return resultState;
}

export const googleAuthApi = async (googleUser) => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/googleauth`;

  await axios({
    method: 'post',
    url: apiUrl,
    data: googleUser
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data;
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.response.data? err.response.data.message : err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const googleSignUpApi = async (googleUser) => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/googleregister`;;

  await axios({
    method: 'post',
    url: apiUrl,
    data: googleUser
  }).then(function (response) {
    resultState.state = "success";
    resultState.data = response.data;
    window.toastr.info('The user is created. An email has been sent to your email address. Please verify your email.')
  }).catch(function(err) {
    resultState.state = 'error';
    resultState.data = err.response.data? err.response.data.message : err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const registerApi = async (userdata) => {
  let resultState = {state: '', data: {}};

  const apiUrl = `${BASE_BACKEND_URL}user/register`;

  await axios({
    method: 'post',
    url: apiUrl,
    data: userdata
  }).then(function(response) {
    resultState.state = 'success';
    resultState.data = response;
    window.toastr.info('The user is created. An email has been sent to your email address. Please verify your email.')
  }).catch(function (err) {
    resultState.state = 'error';
    resultState.data = resultState.data = err.response.data? err.response.data.message : err.message;;
    window.toastr.error(resultState.data);
  })

  return resultState;
}

export const resetPasswordEmail = async (email) => {
  let resultState = {state: '', data: {}};

  const apiUrl = `${BASE_BACKEND_URL}user/resetpasswordemail`;

  await axios({
    method: 'post',
    url: apiUrl,
    data: {email: email},
  }).then(function(response) {
    resultState.state = 'success';
    resultState.data = response.data;
    window.toastr.info('Reset Password email was sent. Please check your email to reset password');
  }).catch(function(err) {
    resultState.state = 'error';
    resultState.data = err.response.data? err.response.data.message : err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}
export const resetPasswordApi = async (newPasswordData) => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/resetPassword`;

  await axios({
    method: 'post',
    url: apiUrl,
    data: newPasswordData,
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data;
    window.toastr.info('Password is Updated');
  }).catch(function(err) {
    console.log('err', err);
    resultState.state = 'error';
    resultState.data = err.response.data? err.response.data.message : err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const createDeviceApi = async (deveInfo) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/createDev`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: deveInfo,
    headers: {Authorization: tokenData}
  }).then(function(response) {
    resultState.state = 'success';
    resultState.data = response.data;
    console.log('getDevicess', response);
  }).catch(function (err){
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const getDevicesApi = async () => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/getClients`;
  
  await axios({
    method: 'post',
    url: apiUrl,
    headers: {Authorization: tokenData}
  }).then(function(response) {
    resultState.state = 'success';
    resultState.data = response.data;
    console.log('getDevicess', response);
  }).catch(function (err){
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const devConnection = async (devId) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/devConnect`;
  
  const data = {devId: devId};
    await axios({
      method: 'post',
      url: apiUrl,
      data: data,
      headers: {Authorization: tokenData}
    }).then(function(response) {
      resultState.state = 'success';
      resultState.data = response.data;
    }).catch(function (err){
      resultState.state = 'error';
      resultState.data = err.message;
      window.toastr.error(resultState.data);
    })
    return resultState;
}

export const getDeviceMessage = async (devId) => {
    let resultState = {state: '', data: {}};
   
    const apiUrl = `${BASE_BACKEND_URL}mqtt/devMessage`;
    await axios({
      method: 'get',
      url: apiUrl,
     }).then(function(response) {
      resultState.state = 'success';
      resultState.data = response.data;
    }).catch(function (err){
      resultState.state = 'error';
      resultState.data = err.message;
    })
    return resultState;
}

export const controlDevice = async (devInfo) => {
    let resultState = {state: '', data: {}};

    const apiUrl = `${BASE_BACKEND_URL}mqtt/devControl`;
    await axios({
        method: 'post',
        url: apiUrl,
        data: devInfo
    }).then(function(response) {
        resultState.state = 'success';
        resultState.data = response.data;
    }).catch(function (err) {
        resultState.state = 'error';
        resultState.data = err.message;
    })

    return resultState;
}