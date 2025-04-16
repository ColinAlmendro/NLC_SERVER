const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//const cloudinary = require("../utils/cloudinaryConfig");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password").sort({ admin: -1, name: 1 });
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
	//console.log("user req body", req.body);
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
		admin: existingUser.admin,
	});
};

const editUser = async (req, res, next) => {
	//console.log("Body:", req.params.userId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const userId = req.params.userId;

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find user.",
			500
		);
		return next(error);
	}

	user.name = req.body.name;
	user.surname = req.body.surname;
	user.dob = req.body.dob;
	user.cell = req.body.cell;
	user.email = req.body.email;
	user.address1 = req.body.address1;
	user.area = req.body.area;

	user.note = req.body.note;

	try {
		await user.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update user.",
			500
		);
		return next(error);
	}

	//////
	res.status(200).json({ user: user.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteUser = async (req, res, next) => {
	const userId = req.params.userId;
	//console.log("ID:", userId);

	try {
		const deletedItem = await User.findByIdAndDelete(userId, {
			new: true,
		});
		if (deletedItem) {
			//console.log("User to be deleted:", deletedItem);
		} else {
			//console.log("No user found with that id.");
			const error = new HttpError("No user found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted user." });
};
/////////////////////////////////////////////////////////////////////////////////
const changeEmail = async (req, res, next) => {
	const { old_email,new_email,confirm_email, old_password } = req.body;

	if (new_email !== confirm_email) {
		const error = new HttpError("New email doesnt match confirm email.", 403);
		return next(error);
	}

	let existingUser;

	try {
		existingUser = await User.findOne({ email:old_email });
	} catch (err) {
		const error = new HttpError(
			"Email check failed",
			500
		);
		return next(err);
	}

	if (!existingUser) {
		const error = new HttpError("Email not found.", 403);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(old_password, existingUser.password);
	} catch (err) {
		const error = new HttpError(
			"Password check failed.",
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError(
			"Invalid password.",
			403
		);
		return next(error);
	}

	try {
		existingUser.email = new_email;
		await existingUser.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update email.",
			500
		);
		return next(error);
	}

	res.status(200).json({ existingUser: existingUser.toObject({ getters: true }) });

};

const changePwd = async (req, res, next) => {
	const { new_password,confirm_password,pwd_email } = req.body;

	//const { old_email, new_email, confirm_email, old_password } = req.body;

	if (new_password !== confirm_password) {
		const error = new HttpError("New password doesnt match confirm password.", 403);
		return next(error);
	}

	let existingUser;

	try {
		existingUser = await User.findOne({ email: pwd_email });
	} catch (err) {
		const error = new HttpError("Email check failed", 500);
		return next(err);
	}

	if (!existingUser) {
		const error = new HttpError("Email not found.", 403);
		return next(error);
	}

	
	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(new_password, 12);
	} catch (err) {
		const error = new HttpError(
			"Could not change password, please try again.",
			500
		);
		return next(error);
	}

	try {
		existingUser.password = hashedPassword;
		await existingUser.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update password.",
			500
		);
		return next(error);
	}

	res
		.status(200)
		.json({ existingUser: existingUser.toObject({ getters: true }) });
};

const getSingleUser = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Email check failed, please try again later.",
			500
		);
		return next(err);
	}

	if (!existingUser) {
		const error = new HttpError(
			"Email not found.",
			403
		);
		return next(error);
	}



	res.json({
		userId: existingUser.id,
		name: existingUser.name,
		email: existingUser.email,
		
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
exports.changePwd = changePwd;
exports.changeEmail = changeEmail;
exports.getSingleUser = getSingleUser;
