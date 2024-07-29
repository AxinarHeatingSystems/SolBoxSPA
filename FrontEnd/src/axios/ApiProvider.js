
import axios from 'axios';

export const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL
export const GoogleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID

console.log(process.env);
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
    // resultState.state = 'success';
    resultState = response.data.data;
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

export const uploadDevImgApi = async (imageForm) => {
  let resultState;
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/uploadDevImage`;
  // axios.post(`${BASE_BACKEND_URL}mqtt/uploadDevImage`, formData, {
  await axios({
    method: 'post',
    url: apiUrl,
    data: imageForm,
    headers: {Authorization: tokenData}
  }).then(res => {
    console.log(res)
    resultState = res;
  }).catch(err => {
    console.log(err)
    resultState = err;
  })
  return resultState;
}

export const getAllDevsApi = async () => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}mqtt/getAllDevs`;
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
    window.toastr.error('Device list Gettting Api is wrong');
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
    resultState.data = err.response?.data? err.response.data.message : err.message;
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
    resultState.data = err.response?.data? err.response.data.message : err.message;
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

export const saveDevScheduleApi = async (devData) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/saveDevSchedule`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: devData,
    headers: {Authorization: tokenData}
  }).then(function(response) {
    // resultState.state = 'success';
    resultState = response.data;
  }).catch(function (err){
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const removeSharedUserApi = async (devData) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/removeSharedUser`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: devData,
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

export const loadSharedUsersApi = async (devData) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/loadDevSharedUsers`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: devData,
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

export const shareDeviceApi =async (shareInfo) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/shareDev`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: shareInfo,
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

export const updateDeviceApi = async (devInfo) => {
  let resultState = {};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/updateDev`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: devInfo,
    headers: {Authorization: tokenData}
  }).then(function(response) {
    resultState = response.data;
    console.log('getDevicess', response);
  }).catch(function (err){
    resultState.state = 'error';
    resultState.data = err.message;
    window.toastr.error(resultState.data);
  })
  return resultState;
}

export const createDeviceApi = async (devInfo) => {
  let resultState = {state: '', data: {}};
  const tokenData = getJWTToken();
  const apiUrl = `${BASE_BACKEND_URL}mqtt/createDev`;
  await axios({
    method: 'post',
    url: apiUrl,
    data: devInfo,
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