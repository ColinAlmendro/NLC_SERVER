const express = require("express");
const { check } = require("express-validator");

const {
	getIngredientList,
	getIngredientById,
	addIngredient,
	editIngredient,
	deleteIngredient,
} = require("../controllers/ingredient-controller");


const router = express.Router();

router.get("/list", getIngredientList);
router.get("/:ingredientId", getIngredientById);
router.post(
	"/new",
	[
		check("category")
			.not()
			.isEmpty()
			.withMessage("Add category"),
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add name"),
		check("description")
			.not()
			.isEmpty()
			.withMessage("Add description"),
		check("price")
			.isDecimal()
			.withMessage("Must be decimal"),
	],
	addIngredient
);

router.patch(
	"/edit/:ingredientId",
	[
		check("category")
			.not()
			.isEmpty()
			.withMessage("Add category"),
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add name"),
		check("description")
			.not()
			.isEmpty()
			.withMessage("Add description"),
		// check("unit")
		// 	.not()
		// 	.isEmpty()
		// 	.withMessage("Add unit"),
		// check("volume")
		// 	.isNumeric()
		// 	.withMessage("Add volume"),
		check("price")
			.isDecimal()
			.withMessage("Must be decimal"),
	],
	editIngredient
);

router.delete("/delete/:ingredientId", deleteIngredient);

module.exports = router;
