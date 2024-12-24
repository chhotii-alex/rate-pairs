function makeTimePromise(seconds) {
	let p = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('timeout');
		}, seconds * 1000);
	});
	return p;
}

function makeEternalPromise() {
	let p = new Promise((resolve, reject) => {
		// do nothing ever
	});
	return p;
}

export { makeTimePromise, makeEternalPromise };
