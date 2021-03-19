import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import useSound from "use-sound";

import "./game.scss";

import TouchSound from "../../assets/audio/touch-sound.mp3";

import { firestore } from "../../firebase/firebase.utils";

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
	const [play] = useSound(TouchSound);

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

	const playSound = () => {
		// const touchSound = new Audio("../../assets/audio/touch-sound.mp3");
		// touchSound.crossOrigin = "anonymus";

		// const playPromise = touchSound.play();

		// if (playPromise !== undefined) {
		// 	playPromise
		// 		.then((info) => {
		// 			console.log(info);
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 		});
		// }

		play();
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

	const showComment = () => {
		const difference = highscore - currentScore;

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
		} else if (difference < 0) {
			const randomNum = Math.floor(Math.random() * 5);
			return comments.highScoreBeats[randomNum];
		}
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
						<div
							className="touch"
							onClick={() => {
								playSound();
								handleTouchClick();
							}}
						></div>{" "}
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
						<p className="game-over-high-score-container text-medium margin-smaller">
							high score <span>{highscore}</span>
						</p>
						<p className="comment margin-big">{showComment()}</p>
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
