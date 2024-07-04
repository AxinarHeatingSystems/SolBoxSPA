
import axios from 'axios';

export const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL

const getJWTToken = () => {
  const strUser = localStorage.getItem('userData');
  const userData = JSON.parse(strUser);
  console.log('using Data', userData);
  return `Bearer ${userData.tokens}`;
}
export const logoutApi = async () => {
  
  localStorage.removeItem("userData");
  window.location.reload();

}
export const existLogin = async () => {
  let resultState = {state: '', data: {}};
  const apiUrl = `${BASE_BACKEND_URL}user/existLogin`;
  const tokenData = getJWTToken();
  await axios({
    method: 'get',
    url: apiUrl,
    headers: {Authorization: tokenData}
  }).then(function(response){
    resultState.state = 'success';
    resultState.data = response.data;
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

export const registerApi = async (userdata) => {
  let resultState = {state: '', data: {}};

  const apiUrl = `${BASE_BACKEND_URL}user/register`;

  await axios({
    method: 'post',
    url: apiUrl,
    data: userdata
  }).then(function(response) {
    resultState.state = 'succes';
    resultState.data = response;
    window.toastr.info('The user is created, Please verify your email')
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