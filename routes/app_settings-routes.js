const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/multer");
const {
	getAppSettings,
	editAppSettings,
} = require("../controllers/app_settings-controller");

const router = express.Router();

router.get("/list", getAppSettings);

// router.put(
router.put(
	"/edit/:appSettingId",
	// [
	// 	check("app_title")
	// 		.not()
	// 		.isEmpty()
	// 		.withMessage("App title required"),
	// ],
	editAppSettings
);

module.exports = router;
