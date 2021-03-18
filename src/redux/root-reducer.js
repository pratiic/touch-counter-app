import { combineReducers } from "redux";

import { optionsReducer } from "./options/options.reducer";

export default combineReducers({
	options: optionsReducer,
});
