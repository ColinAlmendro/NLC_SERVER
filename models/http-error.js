class httpError extends Error {
	constructor(message, errorCode) {
		super(message); //add message property
		this.code = errorCode; //add a code property
	}
}

module.exports = httpError;
