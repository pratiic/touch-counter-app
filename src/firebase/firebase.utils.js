import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDX7PUXGlL4yZ07SNzP_o68pDvlraa3Vvg",
	authDomain: "touch-counter.firebaseapp.com",
	projectId: "touch-counter",
	storageBucket: "touch-counter.appspot.com",
	messagingSenderId: "774417227682",
	appId: "1:774417227682:web:380fa05a0c538b32505cfb",
	measurementId: "G-5ZRQ1KMWNQ",
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const deleteFromCurrentPlayers = (userId) => {
	const currentPlayersCollectionRef = firestore.collection("current-players");

	currentPlayersCollectionRef.doc(userId).delete();
};
