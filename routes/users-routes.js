const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");
// const fileUpload = require("../middleware/multer");
// const cloudinary = require("../utils/cloudinaryConfig");
const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
	"/signup",
	// fileUpload.single("image"),

	[
		check("name")
			.not()
			.isEmpty(),
		check("email")
			.normalizeEmail()
			.isEmail(),
		check("password").isLength({ min: 6 }),
	],

	usersController.signup
);

router.post("/login", usersController.login);
router.post("/editUser", usersController.editUser);
router.post("/deleteUser", usersController.deleteUser);
router.post(
	"/changePwd",
	[
		check("old_email")
			.normalizeEmail()
			.isEmail(),
		check("password").isLength({ min: 6 }),
	],
	usersController.changePwd
);
router.post(
	"/changeEmail",
	[
		check("pwd_email")
			.normalizeEmail()
			.isEmail(),
		check("new_password").isLength({ min: 6 }),
		check("confirm_password").isLength({ min: 6 }),
	],
	usersController.changeEmail
);
router.post("/getSingleUser", usersController.getSingleUser);

module.exports = router;
