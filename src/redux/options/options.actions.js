import { optionsActionTypes } from "./options.types";

export const setUsername = (username) => {
	return {
		type: optionsActionTypes.SET_USERNAME,
		payload: username,
	};
};

export const setTime = (time) => {
	return {
		type: optionsActionTypes.SET_TIME,
		payload: time,
	};
};
