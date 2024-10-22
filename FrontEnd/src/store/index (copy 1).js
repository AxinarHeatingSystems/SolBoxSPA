import { createStore, applyMiddleware, compose } from "redux";
import createDebounce from "redux-debounced";
import thunk from "redux-thunk";
// import rootReducer from "./reducers/index";
import { mainStore } from "./reducers/mainReducer";

const middlewares = [thunk, createDebounce()];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configureStore = (preloadedState) => createStore(
	mainStore,
	preloadedState,
	composeEnhancers(applyMiddleware(...middlewares))
);
export default configureStore;
