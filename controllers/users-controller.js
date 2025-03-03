const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cloudinary = require("../utils/cloudinaryConfig");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
	let users;
	try {
		 users = await User.find({}, "-password");
		//users = await User.find();
	} catch (err) {
		const error = new HttpError(
			"Fetching users failed, please try again later.",
			500
		);
		return next(error);
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	console.log("user req body",req.body)
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passed, please check your data.", 422)
		);
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			"User exists already, please login instead.",
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError(
			"Could not create user, please try again.",
			500
		);
		return next(error);
	}

	try {
		// Upload image to cloudinary
		//console.log("req.file.path..", req.file.path);
		//const result = await cloudinary.uploader.upload(req.file.path);
		const createdUser = new User({
			name: req.body.name,
			email: req.body.email,
			// image: result.secure_url,
			// cloudinary_id: result.public_id,
			password: hashedPassword,
			admin: false,
		});
		await createdUser.save();
		// res.json(createdUser);
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	// const createdUser = new User({
	// 	name,
	// 	email,
	// 	image: uploadResult.secure_url,
	// 	cloudinary_id: uploadResult.public_id,
	// 	password: hashedPassword,
	// });

	// try {
	// 	await createdUser.save();
	// } catch (err) {
	// 	const error = new HttpError(
	// 		"Signing up failed, please try again later.",
	// 		500
	// 	);
	// 	return next(error);
	// }

	let token;
	try {
		console.log("process.env.JWT_KEY", process.env.JWT_KEY);
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			process.env.JWT_KEY,
			{ expiresIn: "12h" }
		);
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	res
		.status(201)
		.json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again later.",
			500
		);
		return next(err);
	}

	if (!existingUser) {
		const error = new HttpError(
			"Invalid credentials, could not log you in.",
			403
		);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError(
			"Could not log you in, please check your credentials and try again.",
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError(
			"Invalid credentials, could not log you in.",
			403
		);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again later.",
			500
		);
		return next(err);
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
		admin:existingUser.admin,
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
