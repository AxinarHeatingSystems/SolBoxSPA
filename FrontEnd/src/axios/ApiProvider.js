
import axios from 'axios';

export const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL

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
    resultState.state = 'error';
    resultState.data = err.message;
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
  }).catch(function (err) {
    resultState.state = 'error';
    resultState.data = err.message;
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
  }).catch(function(err) {
    resultState.state = 'error';
    resultState.data = err.message;
  })
  return resultState;
}

export const devConnection = async (devId) => {
  let resultState = {state: '', data: {}};

  const apiUrl = `${BASE_BACKEND_URL}mqtt/devConnect`;
  
  const data = {devId: devId};
    await axios({
      method: 'post',
      url: apiUrl,
      data: data
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