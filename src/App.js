import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "./App.scss";

import Header from "./components/header/header";
import SetGame from "./components/set-game/set-game";
import Game from "./components/game/game";

const App = ({ username }) => {
	const [gameSet, setGameSet] = useState(false);

	useEffect(() => {
		setGameSet(false);
	}, []);

	const setGame = (username) => {
		setGameSet(true);
	};

	const resetGame = () => {
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
							<Game resetGame={resetGame} />
						) : (
							<Redirect to="/" />
						)}
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		username: state.options.username,
	};
};

export default connect(mapStateToProps)(App);
