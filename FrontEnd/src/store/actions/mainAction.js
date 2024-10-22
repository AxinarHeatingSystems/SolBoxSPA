import { ISMOBILEDETECT, ISPORTRAIT, USERDATA, ISLOGGEDIN, COLORMODENAME, LANGUAGECODE, DEVMETADATA, DEVINFODATA } from "../constants/main";

export const isMobileDetect_Store = (params) => {
    return (dispatch) => 
        dispatch({type: ISMOBILEDETECT, payload: params});
}

export const isPortrait_Store = (params) => {
    return (dispatch) => 
        dispatch({type: ISPORTRAIT, payload: params});
}

export const userData_Store = (params) => {
    return (dispatch) =>
        dispatch({type: USERDATA, payload: params})
}

export const isLoggedIn_Store = (params) => {
    return (dispatch) => 
        dispatch({type: ISLOGGEDIN, payload: params});
}

export const colorMode_Store = (params) => {
    return (dispatch) => 
        dispatch({type: COLORMODENAME, payload: params});
}

export const langugeCode_Store = (params) => {
    return (dispatch) => 
        dispatch({type: LANGUAGECODE, payload: params});
}

export const devMetaData_Store = (params) => {
    return (dispatch) => 
        dispatch({type: DEVMETADATA, payload: params});
}

export const devInfoData_Store = (params) => {
    return (dispatch) => 
        dispatch({type: DEVINFODATA, payload: params});
}