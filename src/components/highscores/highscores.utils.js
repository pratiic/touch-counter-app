export const sortByTime = (docs) => {
	const n = docs.length;
	if (docs.length > 1) {
		for (let i = 0; i < n - 1; i++) {
			for (let j = 0; j < n - i - 1; j++) {
				if (
					docs[j].data().score === docs[j + 1].data().score &&
					docs[j].data().createdAt < docs[j + 1].data().createdAt
				) {
					let temp = docs[j];
					docs[j] = docs[j + 1];
					docs[j + 1] = temp;
				}
			}
		}
	}
	return docs;
};
