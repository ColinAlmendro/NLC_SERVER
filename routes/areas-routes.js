const express = require("express");
const { check } = require("express-validator");

const {
	getAreaList,
	getAreaById,
	addArea,
	editArea,
	deleteArea,
} = require("../controllers/area-controller");

const router = express.Router();

router.get("/list", getAreaList);
router.get("/:areaId", getAreaById);
router.post(
	"/new",
	[
		check("area")
			.not()
			.isEmpty()
			.withMessage("Add area"),
	],
	addArea
);

router.patch(
	"/edit/:areaId",
	[
		check("area")
			.not()
			.isEmpty()
			.withMessage("Add area"),
	],
	editArea
);

router.delete("/delete/:areaId", deleteArea);

module.exports = router;
