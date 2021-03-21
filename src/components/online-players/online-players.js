import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./online-players.scss";

import { firestore } from "../../firebase/firebase.utils";

const OnlinePlayers = () => {
	const [onlinePlayers, setOnlinePlayers] = useState([]);

	useEffect(() => {
		const currentPlayersCollectionRef = firestore.collection(
			"current-players"
		);

		currentPlayersCollectionRef.onSnapshot((snapshot) => {
			currentPlayersCollectionRef.get().then((collectionRef) => {
				setOnlinePlayers(
					collectionRef.docs.map((doc) => {
						return {
							username: doc.data().username,
							gameTime: doc.data().gameTime,
							currentScore: doc.data().currentScore,
						};
					})
				);
			});
		});
	});

	return (
		<div className="online-players">
			<div className="title">online players ({onlinePlayers.length})</div>
			{onlinePlayers.map((onlinePlayer) => {
				return (
					<div
						className="online-player"
						key={`${onlinePlayer.username}${onlinePlayer.gameTime}${onlinePlayer.currentScore}`}
					>
						{" "}
						<span className="username">
							{" "}
							{onlinePlayer.username}{" "}
						</span>{" "}
						in
						<span className="game-time">
							{" "}
							{onlinePlayer.gameTime}{" "}
						</span>{" "}
						seconds score{" "}
						<span className="current-score">
							{" "}
							{onlinePlayer.currentScore}{" "}
						</span>{" "}
					</div>
				);
			})}
			<p>and you</p>
			<Link to="/game" className="custom-button">
				back to game
			</Link>
		</div>
	);
};

export default OnlinePlayers;
