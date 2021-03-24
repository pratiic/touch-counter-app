import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCUR846_J9n0XpZK9tS4z07gY7QZqAzyzQ",
	authDomain: "touch-counter-2493a.firebaseapp.com",
	projectId: "touch-counter-2493a",
	storageBucket: "touch-counter-2493a.appspot.com",
	messagingSenderId: "690659440642",
	appId: "1:690659440642:web:5191c47c510db82eae0f1b",
	measurementId: "G-Q2ZLYL2R7Q",
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const deleteFromCurrentPlayers = (userId) => {
	const currentPlayersCollectionRef = firestore.collection("current-players");

	currentPlayersCollectionRef.doc(userId).delete();
};
