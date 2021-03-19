import { optionsActionTypes } from "./options.types";

const INITIAL_STATE = {
	username: "unknown",
	time: 60,
};

export const optionsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case optionsActionTypes.SET_USERNAME:
			return { ...state, username: action.payload };
		case optionsActionTypes.SET_TIME:
			return { ...state, time: action.payload };
		default:
			return state;
	}
};
