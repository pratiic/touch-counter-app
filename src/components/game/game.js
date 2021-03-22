import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./game.scss";

import {
	firestore,
	deleteFromCurrentPlayers,
} from "../../firebase/firebase.utils";
import { sortByTime } from "../highscores/highscores.utils";

import CustomButton from "../../components/custom-button/custom-button";

const Game = ({ username, gameTime, resetGame }) => {
	const [currentScore, setCurrentScore] = useState(0);
	let [time, setTime] = useState(gameTime);
	const [highscore, setHighscore] = useState(0);
	const [highscorePlayer, setHighscorePlayer] = useState("");
	const [gameOver, setGameOver] = useState(false);
	const [onlinePlayersNum, setOnlinePlayersNum] = useState(0);
	const [onlinePlayers, setOnlinePlayers] = useState([]);
	const [userId, setUserId] = useState(`${username}${new Date().getTime()}`);
	const [highscoreMessage, setHighscoreMessage] = useState(
		"loading highscore..."
	);
	const [comments] = useState({
		notEvenClose: "come on man, that's not even close",
		youCanDoBetter: "you can do better",
		goHomeAndPractice: "i think you should go home and practice",
		thatsGood: "that's good, do better next time",
		jesusChrist: "jesus christ, are you even trying?",
		thatsGottaHurt: "that's gotta hurt",
		thatsNotGonnaDoIt: "that's not gonna go it",
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

		const unSubscribeFromCollection = scoresCollectionRef.onSnapshot(
			(snapshot) => {
				scoresCollectionRef
					.orderBy("score", "desc")
					.limit(50)
					.get()
					.then((collectionRef) => {
						if (collectionRef.docs.length > 0) {
							const sortedDocs = sortByTime(collectionRef.docs);
							const data = sortedDocs[0].data();
							setHighscore(data.score);
							setHighscorePlayer(data.player);
						} else {
							setHighscoreMessage(
								`no highscore in ${gameTime} seconds`
							);
						}
					});
			}
		);

		const currentPlayersCollectionRef = firestore.collection(
			"current-players"
		);

		currentPlayersCollectionRef.doc(userId).set({
			username: username,
			gameTime: Number(gameTime),
			currentScore: currentScore,
		});

		currentPlayersCollectionRef.onSnapshot((snapshot) => {
			currentPlayersCollectionRef.get().then((collectionRef) => {
				if (collectionRef.docs.length > 0) {
					setOnlinePlayersNum(collectionRef.docs.length);
				}
			});
		});

		return () => {
			unSubscribeFromCollection();
			clearInterval(countdownInterval);
			deleteFromCurrentPlayers(userId);
			console.log("pratiic");
		};
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		firestore
			.collection("current-players")
			.doc(userId)
			.update({ currentScore: currentScore });
	}, [currentScore]);

	useEffect(() => {
		if (gameOver) {
			clearInterval(countdownInterval);
			firestore
				.collection("all-scores")
				.doc(`${gameTime}`)
				.collection("scores")
				.add({
					score: currentScore,
					player: username,
					createdAt: new Date().getTime(),
				})
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
		} else if (difference < 10) {
			return comments.thatsGottaHurt;
		} else if (difference < 30) {
			return comments.thatsGood;
		} else if (difference <= 50) {
			return comments.thatsNotGonnaDoIt;
		} else if (difference <= 100) {
			return comments.goHomeAndPractice;
		} else if (difference > 100) {
			return comments.notEvenClose;
		} else if (difference > 150) {
			return comments.jesusChrist;
		}
	};

	const replay = () => {
		clearInterval(countdownInterval);
		setTime(gameTime);
		setCurrentScore(0);
		setGameOver(false);
	};

	return (
		<div className="game">
			<div className="wrapper">
				{time > 0 ? (
					<React.Fragment>
						<div className="info">
							<div className="highscore-container">
								{highscore > 0 ? (
									<React.Fragment>
										high score in {gameTime} seconds
										<span> {highscore}</span> by{" "}
										<span>{highscorePlayer}</span>
									</React.Fragment>
								) : (
									<p>{highscoreMessage}</p>
								)}
							</div>
							{/* <p className="online-players">
								online players <span>{onlinePlayersNum}</span>
								{onlinePlayersNum <= 1 ? (
									<span>(you)</span>
								) : (
									<Link
										to="/online-players"
										className="custom-button custom-button-smallest"
									>
										view here
									</Link>
								)}
							</p> */}
							<p className="timer lighter">
								{" "}
								timer{" "}
								<span
									className={`countdown text-big ${
										time <= 5 ? "time-finish" : ""
									}`}
								>
									{time}
								</span>
							</p>
							<p className={`current-score-container lighter`}>
								{" "}
								current score{" "}
								<span className="current-score text-big">
									{currentScore}
								</span>
							</p>
						</div>
						<div className="touch" onClick={handleTouchClick}></div>{" "}
						<div className="buttons">
							<div className="buttons-upper">
								<CustomButton handleButtonClick={replay}>
									play again
								</CustomButton>
								<Link
									to="/highscores"
									className="custom-button"
								>
									highscores
								</Link>
							</div>
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
						<div className="gameover">
							<div className="info">
								<p className="game-over text-big text-blue margin-smaller">
									game over
								</p>
								<p className="total-score-container text-medium margin-smaller">
									total score <span>{currentScore}</span>
								</p>
								<p className="game-over-high-score-container text-medium margin-smaller">
									high score <span>{highscore}</span>
								</p>
								<p className="comment margin-big">
									{showComment()}
								</p>
							</div>
							<div className="buttons">
								<div className="buttons-upper">
									<CustomButton handleButtonClick={replay}>
										play again
									</CustomButton>
									<Link
										to="/highscores"
										className="custom-button"
									>
										highscores
									</Link>
								</div>
								<Link
									to="/"
									className="custom-button reset"
									onClick={resetGame}
								>
									reset
								</Link>
							</div>
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
