import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "./App.scss";

import Header from "./components/header/header";
import SetGame from "./components/set-game/set-game";
import Game from "./components/game/game";
import Highscores from "./components/highscores/highscores";

const App = ({ username, gameTime }) => {
	const [gameSet, setGameSet] = useState(false);

	console.log(username, gameTime);

	useEffect(() => {
		setGameSet(false);
	}, []);

	const setGame = () => {
		setGameSet(true);
	};

	const resetGame = () => {
		setGameSet(false);
	};

	const replay = () => {
		setGameSet(false);
	};

	return (
		<div className="app">
			<Header resetGame={resetGame} />
			<BrowserRouter>
				<Switch>
					<Route path="/" exact>
						{!gameSet ? (
							<SetGame setGame={setGame} />
						) : (
							<Redirect to="/game" />
						)}
					</Route>
					<Route path="/game">
						{gameSet ? (
							<Game resetGame={resetGame} replay={replay} />
						) : (
							<Redirect to="/" />
						)}
					</Route>
					<Route path="/highscores">
						{gameSet ? <Highscores /> : <Redirect to="/" />}
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		username: state.options.username,
		gameTime: state.options.time,
	};
};

export default connect(mapStateToProps)(App);
