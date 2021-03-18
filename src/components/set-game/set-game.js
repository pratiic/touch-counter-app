import React, { useState } from "react";
import { connect } from "react-redux";

import "./set-game.scss";

import { setUsername, setTime } from "../../redux/options/options.actions";

import CustomButton from "../custom-button/custom-button";

const SetGame = ({ setGame, setGameUsername, setGameTime }) => {
	const [username, setUsername] = useState("unknown");
	const [time, setTime] = useState(60);
	const [usernameError, setUsernameError] = useState(false);
	const [timeError, setTimeError] = useState(false);

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleTimeChange = (event) => {
		setTime(event.target.value);
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();

		if (username.length === 0 || time <= 0) {
			if (username.length === 0) {
				setUsernameError(true);
			} else {
				setUsernameError(false);
			}

			if (time <= 0) {
				setTimeError(true);
			} else {
				setTimeError(false);
			}
		} else {
			setGame(username);
			setGameUsername(username);
			setGameTime(time);
		}
	};

	return (
		<div className="set-game">
			<form onSubmit={handleFormSubmit}>
				<p className="title">fill this out to start the game</p>
				<div className="input-group">
					<input
						type="text"
						value={username}
						onChange={handleUsernameChange}
					/>
					<label>username</label>
					<small className={usernameError ? "show" : null}>
						this field is required
					</small>
				</div>
				<div className="input-group">
					<input
						type="text"
						value={time}
						onChange={handleTimeChange}
					/>
					<label>time (in seconds)</label>
					<small className={timeError ? "show" : null}>
						this field is required
					</small>
				</div>
				<CustomButton>play</CustomButton>
			</form>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGameUsername: (username) => {
			dispatch(setUsername(username));
		},
		setGameTime: (time) => {
			dispatch(setTime(time));
		},
	};
};

export default connect(null, mapDispatchToProps)(SetGame);
