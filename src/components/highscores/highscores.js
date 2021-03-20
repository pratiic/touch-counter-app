import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./highscores.scss";

import { firestore } from "../../firebase/firebase.utils";

const Highscores = ({ gameTime }) => {
	const [highscores, setHighscores] = useState([]);

	useEffect(() => {
		const scoresCollectionRef = firestore
			.collection("all-scores")
			.doc(`${gameTime}`)
			.collection("scores");

		scoresCollectionRef.onSnapshot((snapshot) => {
			scoresCollectionRef
				.orderBy("score", "desc")
				.limit(3)
				.get()
				.then((collectionRef) => {
					if (collectionRef.docs.length > 0) {
						setHighscores(collectionRef.docs);
					}
				});
		});
	});

	return (
		<div className="highscores">
			<div className="wrapper">
				<div className="title">top 3 scores</div>
				{highscores.length > 0 ? (
					highscores.map((highscore) => {
						return (
							<div
								className="highscore"
								key={`${highscore.data().player}${
									highscore.data().score
								}${new Date().getTime()}`}
							>
								<span>{highscore.data().player}</span>
								<span>{highscore.data().score}</span>
							</div>
						);
					})
				) : (
					<p className="alternate">
						no high score in {gameTime} seconds
					</p>
				)}
				<Link to="/game" className="custom-button">
					back to game
				</Link>
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
