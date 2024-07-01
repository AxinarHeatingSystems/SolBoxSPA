import { ISMOBILEDETECT, ISPORTRAIT, USERDATA, ISLOGGEDIN, COLORMODENAME } from "../constants/main";

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

        default: {
			return { ...state };
		}
    }
}