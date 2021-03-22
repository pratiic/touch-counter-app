import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./highscores.scss";

import { firestore } from "../../firebase/firebase.utils";
import { sortByTime } from "./highscores.utils";

const Highscores = ({ gameTime }) => {
	const [highscores, setHighscores] = useState([]);
	const [highscoresMessage, setHighscoresMessage] = useState(
		"loading highscores..."
	);

	useEffect(() => {
		const scoresCollectionRef = firestore
			.collection("all-scores")
			.doc(`${gameTime}`)
			.collection("scores");

		scoresCollectionRef.onSnapshot((snapshot) => {
			scoresCollectionRef
				.orderBy("score", "desc")
				.limit(50)
				.get()
				.then((collectionRef) => {
					if (collectionRef.docs.length > 0) {
						const sortedDocs = sortByTime(collectionRef.docs);
						setHighscores(sortedDocs);
					} else {
						setHighscoresMessage(
							`no highscore in ${gameTime} seconds`
						);
					}
				});
		});
		//eslint-disable-next-line
	}, []);

	const renderHighscores = () => {
		return highscores.map((highscore) => {
			return (
				<div className="highscore" key={highscore.id}>
					<span className="dot-dot-dot">
						{highscore.data().player}
					</span>
					<span>{highscore.data().score}</span>
				</div>
			);
		});
	};

	return (
		<div className="highscores">
			<div className="wrapper">
				<div className="title">top 3 scores</div>
				{highscores.length > 0 ? (
					renderHighscores()
				) : (
					<p className="alternate">{highscoresMessage}</p>
				)}
				<Link to="/game" className="custom-button">
					back to game
				</Link>
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
		gameTime: state.options.time,
	};
};

export default connect(mapStateToProps)(Highscores);
