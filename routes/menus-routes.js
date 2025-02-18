const express = require("express");
const { check } = require("express-validator");

const {
	getMenuList,
	getMenuById,
	addMenu,
	editMenu,
	deleteMenu,
} = require("../controllers/menu-controller");

const router = express.Router();

router.get("/list", getMenuList);
router.get("/:menuId", getMenuById);
router.post(
	"/new",
	[
		check("date")
			.not()
			.isEmpty(),
		// check("promotion")
		// 	.not()
		// 	.isEmpty(),
		// check("monday")
		// 	.not()
		// 	.isEmpty(),
		// check("tuesday")
		// 	.not()
		// 	.isEmpty(),
		// check("wednesday")
		// 	.not()
		// 	.isEmpty(),
		// check("thursday")
		// 	.not()
		// 	.isEmpty(),
		// check("friday")
		// 	.not()
		// 	.isEmpty(),
		// check("frozen")
		// 	.not()
		// 	.isEmpty(),
		// check("vegies")
		// 	.not()
		// 	.isEmpty(),
		// check("salads")
		// 	.not()
		// 	.isEmpty(),
		// check("soups")
		// 	.not()
		// 	.isEmpty(),
		// check("sides")
		// 	.not()
		// 	.isEmpty(),
	],
	addMenu
);

router.patch(
	"/edit/:menuId",
	[
		check("date")
			.not()
			.isEmpty(),
		check("promotion")
			.not()
			.isEmpty(),
		// check("monday")
		// 	.not()
		// 	.isEmpty(),
		// check("tuesday")
		// 	.not()
		// 	.isEmpty(),
		// check("wednesday")
		// 	.not()
		// 	.isEmpty(),
		// check("thursday")
		// 	.not()
		// 	.isEmpty(),
		// check("friday")
		// 	.not()
		// 	.isEmpty(),
		// check("frozen")
		// 	.not()
		// 	.isEmpty(),
		// check("vegies")
		// 	.not()
		// 	.isEmpty(),
		// check("salads")
		// 	.not()
		// 	.isEmpty(),
		// check("soups")
		// 	.not()
		// 	.isEmpty(),
		// check("sides")
		// 	.not()
		// 	.isEmpty(),
	],
	editMenu
);

router.delete("/delete/:menuId", deleteMenu);

module.exports = router;
