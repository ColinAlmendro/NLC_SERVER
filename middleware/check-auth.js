const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	try {
		const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error("Authentication failed!");
		}
		//console.log("process.env.JWT_KEY", process.env.JWT_KEY);
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError("Authentication failed!", 403);
		return next(error);
	}
};
