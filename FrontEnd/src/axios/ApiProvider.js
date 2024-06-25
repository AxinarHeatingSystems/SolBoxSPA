
import axios from 'axios';

export const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL

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