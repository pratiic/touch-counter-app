import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./game.scss";

import { firestore } from "../../firebase/firebase.utils";

const Game = ({ username, gameTime, resetGame }) => {
	const [currentScore, setCurrentScore] = useState(0);
	let [time, setTime] = useState(gameTime);
	const [highscore, setHighscore] = useState(0);
	const [highscorePlayer, setHighscorePlayer] = useState("");
	const [gameOver, setGameOver] = useState(false);
	// const [touchSound] = useState(
	// 	new Audio("../../assets/audio/touch-sound.mp3")
	// );

	useEffect(() => {
		const highscoresCollectionRef = firestore.collection("highscores");

		highscoresCollectionRef.onSnapshot((snapshot) => {
			highscoresCollectionRef
				.doc(`${gameTime}`)
				.get()
				.then((docRef) => {
					if (docRef.exists) {
						setHighscore(docRef.data().score);
						setHighscorePlayer(docRef.data().player);
					}
				});
		});
	});

	useEffect(() => {
		if (gameOver) {
			if (currentScore > highscore) {
				console.log("pratiic");
				firestore
					.collection("highscores")
					.doc(`${gameTime}`)
					.set({ score: currentScore, player: username })
					.then((docRef) => {
						console.log(docRef);
					});
			}
		}
		//eslint-disable-next-line
	}, [gameOver]);

	const handleTouchClick = () => {
		if (time > 0) {
			console.log(time);
			setCurrentScore(currentScore + 1);

			if (currentScore === 0) {
				startCountdown();
			}
		}
	};

	const startCountdown = () => {
		setInterval(() => {
			if (time > 0) {
				setTime(--time);
			}

			if (time === 0) {
				setGameOver(true);
			}
		}, 1000);
	};

	return (
		<div className="game">
			<div className="wrapper">
				{time > 0 ? (
					<React.Fragment>
						<div className="highscore-container margin-small">
							{highscore > 0 ? (
								<React.Fragment>
									high score in {gameTime} seconds
									<span> {highscore}</span> by{" "}
									<span>{highscorePlayer}</span>
								</React.Fragment>
							) : (
								<p>no high score in {gameTime} seconds</p>
							)}
						</div>
						<p className="timer lighter margin-small">
							{" "}
							timer{" "}
							<span className="countdown text-big">{time}</span>
						</p>
						<p className="current-score-container lighter margin-big">
							{" "}
							current score{" "}
							<span className="current-score text-big">
								{currentScore}
							</span>
						</p>
						<div className="touch" onClick={handleTouchClick}></div>{" "}
						<Link
							to="/"
							className="custom-button reset"
							onClick={resetGame}
						>
							reset
						</Link>
					</React.Fragment>
				) : (
					<React.Fragment>
						<p className="game-over text-big text-blue margin-smaller">
							game over
						</p>
						<p className="total-score-container text-medium margin-smaller">
							total score <span>{currentScore}</span>
						</p>
						<p className="game-over-high-score-container text-medium margin-big">
							high score <span>{highscore}</span>
						</p>
						{/* <CustomButton
						handleButtonClick={handlePlayAgainButtonClick}
					>
						play again
					</CustomButton> */}
						<Link
							to="/"
							className="custom-button"
							onClick={resetGame}
						>
							play again
						</Link>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		gameTime: state.options.time,
		username: state.options.username,
	};
};

export default connect(mapStateToProps)(Game);
