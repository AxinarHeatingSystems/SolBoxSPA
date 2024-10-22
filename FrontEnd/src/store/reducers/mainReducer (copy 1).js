import { ISMOBILEDETECT, ISPORTRAIT, USERDATA, ISLOGGEDIN, COLORMODENAME, LANGUAGECODE, DEVMETADATA, DEVINFODATA } from "../constants/main";

export const mainStore = (state = {}, action) => {
    switch(action.type) {
        case ISMOBILEDETECT: {
            return {
                ...state,
                isMobileDetect: action.payload
            };
        }

        case ISPORTRAIT: {
            return {
                ...state,
                isPortrait: action.payload
            }
        }

        case USERDATA: {
            return {
                ...state,
                userData: action.payload
            }
        }

        case ISLOGGEDIN: {
            return {
                ...state,
                isLoggedIn: action.payload
            }
        }

        case COLORMODENAME: {
            return {
                ...state,
                colorModeName: action.payload
            }
        }

        case LANGUAGECODE: {
            return {
                ...state,
                langugeCode: action.payload
            }
        }

        case DEVMETADATA: {
            return {
                ...state,
                devMetaData: action.payload
            }
        }

        case DEVINFODATA: {
            return {
                ...state,
                devInfoData: action.payload
            }
        }

        default: {
			return { ...state };
		}
    }
}