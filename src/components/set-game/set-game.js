import React, { useState } from "react";
import { connect } from "react-redux";

import "./set-game.scss";

import { setUsername, setTime } from "../../redux/options/options.actions";

import CustomButton from "../custom-button/custom-button";

const SetGame = ({
	setGame,
	setGameUsername,
	setGameTime,
	gameUsername,
	gameTime,
}) => {
	const [username, setUsername] = useState(gameUsername);
	const [time, setTime] = useState(gameTime);
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

		const numberRegExp = /^[0-9]*$/;

		const validNumber = numberRegExp.test(time);

		if (username.length === 0 || time <= 0 || !validNumber) {
			if (username.length === 0) {
				setUsernameError(true);
			} else {
				setUsernameError(false);
			}

			if (!validNumber) {
				setTimeError("please enter a valid time");
			} else if (!time) {
				setTimeError("this field is required");
			} else if (time === "0") {
				setTimeError("time should be greater than 0");
			} else {
				setTimeError("");
			}

			// if (time <= 0) {
			// 	setTimeError("time should be greater than 0");
			// } else {
			// 	setTimeError("");
			// }
		} else {
			setGame(username);
			setGameUsername(username);
			setGameTime(time);
		}
	};

	return (
		<div className="set-game">
			<div className="wrapper">
				<form onSubmit={handleFormSubmit}>
					<p className="title">fill this out to start the game</p>
					<div className="input-group">
						<input
							type="text"
							value={username}
							onChange={handleUsernameChange}
						/>
						<label>username</label>
						<small>
							{usernameError ? "this field is required" : null}
						</small>
					</div>
					<div className="input-group">
						<input
							type="text"
							value={time}
							onChange={handleTimeChange}
						/>
						<label>time (in seconds)</label>
						<small>{timeError}</small>
					</div>
					<CustomButton>play</CustomButton>
				</form>
				<p className="score-reset-info">
					if you don't see your score, its because the database was
					reset because of some changes
				</p>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		gameUsername: state.options.username,
		gameTime: state.options.time,
	};
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

export default connect(mapStateToProps, mapDispatchToProps)(SetGame);
