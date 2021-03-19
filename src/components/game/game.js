import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./game.scss";

import { firestore } from "../../firebase/firebase.utils";

import CustomButton from "../../components/custom-button/custom-button";

const Game = ({ username, gameTime, resetGame }) => {
	const [currentScore, setCurrentScore] = useState(0);
	let [time, setTime] = useState(gameTime);
	const [highscore, setHighscore] = useState(0);
	const [highscorePlayer, setHighscorePlayer] = useState("");
	const [gameOver, setGameOver] = useState(false);
	const [comments] = useState({
		notEvenClose: "come on man, that's not even close",
		youCanDoBetter: "you can do better",
		goHomeAndPractice: "i think you should go home and practice",
		thatsGood: "that's good, do better next time",
		jesusChrist: "jesus christ, are you even trying?",
		thatsGottaHurt: "that's gotta hurt",
		thatsClose: "that's close, beat it next time man",
		highScoreBeats: [
			"looks like you beat it, well done",
			"attaboy, or are you a girl?",
			"yessssssssss, you did it",
			"way to go",
			"great",
		],
	});
	const [countdownInterval, setCountdownInterval] = useState(null);

	useEffect(() => {
		const scoresCollectionRef = firestore
			.collection("all-scores")
			.doc(`${gameTime}`)
			.collection("scores");

		scoresCollectionRef.onSnapshot((snapshot) => {
			scoresCollectionRef
				.orderBy("score", "desc")
				.limit(1)
				.get()
				.then((collectionRef) => {
					if (collectionRef.docs.length > 0) {
						const data = collectionRef.docs[0].data();
						setHighscore(data.score);
						setHighscorePlayer(data.player);
					}
				});
		});
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (gameOver) {
			firestore
				.collection("all-scores")
				.doc(`${gameTime}`)
				.collection("scores")
				.add({ score: currentScore, player: username })
				.then((docRef) => {
					console.log(docRef);
				});
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
		// const timeInterval = setInterval(() => {
		// 	if (time > 0) {
		// 		setTime(--time);
		// 	}

		// 	if (time === 0) {
		// 		setGameOver(true);
		// 	}
		// }, 1000);
		setCountdownInterval(
			setInterval(() => {
				if (time > 0) {
					setTime(--time);
				}

				if (time === 0) {
					setGameOver(true);
				}
			}, 1000)
		);
	};

	const showComment = () => {
		const difference = highscore - currentScore;

		if (difference <= 0) {
			const randomNum = Math.floor(Math.random() * 5);
			return comments.highScoreBeats[randomNum];
		}

		if (difference > 250) {
			return comments.jesusChrist;
		} else if (difference > 150) {
			return comments.notEvenClose;
		} else if (difference > 100) {
			return comments.youCanDoBetter;
		} else if (difference < 10) {
			return comments.thatsGottaHurt;
		} else if (difference < 40) {
			return comments.thatsClose;
		} else if (difference <= 50) {
			return comments.thatsGood;
		} else if (difference <= 100) {
			return comments.goHomeAndPractice;
		}
	};

	const replay = () => {
		console.log(countdownInterval);
		clearInterval(countdownInterval);
		setTime(gameTime);
		setCurrentScore(0);
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
						<p className="current-score-container lighter">
							{" "}
							current score{" "}
							<span className="current-score text-big">
								{currentScore}
							</span>
						</p>
						<div className="touch" onClick={handleTouchClick}></div>{" "}
						<div className="buttons">
							<CustomButton handleButtonClick={replay}>
								play again
							</CustomButton>
							<Link to="/highscores" className="custom-button">
								highscores
							</Link>
							<Link
								to="/"
								className="custom-button reset"
								onClick={resetGame}
							>
								reset
							</Link>
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<p className="game-over text-big text-blue margin-smaller">
							game over
						</p>
						<p className="total-score-container text-medium margin-smaller">
							total score <span>{currentScore}</span>
						</p>
						<p className="game-over-high-score-container text-medium margin-smaller">
							high score <span>{highscore}</span>
						</p>
						<p className="comment margin-big">{showComment()}</p>
						{/* <CustomButton
						handleButtonClick={handlePlayAgainButtonClick}
					>
						play again
					</CustomButton> */}
						<div className="buttons">
							<Link
								to="/"
								className="custom-button reset"
								onClick={resetGame}
							>
								reset
							</Link>
							<CustomButton handleButtonClick={replay}>
								play again
							</CustomButton>
						</div>
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
