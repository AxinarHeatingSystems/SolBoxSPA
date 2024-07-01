import { mainStore } from "./mainReducer";

function rootReducer(state = {}, action) {
	return {
		maindata: mainStore(state.maindata, action),
	};
}
export default rootReducer;