const express = require("express");
const { check } = require("express-validator");

const {
	getRecipeList,
	getRecipeById,
	addRecipe,
	editRecipe,
	deleteRecipe,
} = require("../controllers/recipe-controller");
// const fileUpload = require("../middleware/multer");

const router = express.Router();

router.get("/list", getRecipeList);
router.get("/:recipeId", getRecipeById);
router.post(
	"/new",
	// fileUpload.single("image"),
	[
		check("category")
			.not()
			.isEmpty()
			.withMessage("Add category"),
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add recipe name"),
		check("description")
			.not()
			.isEmpty()
			.withMessage("Add recipe description"),
		// check("ingredients")
		// 	.not()
		// 	.isEmpty()
		// 	.withMessage("Add recipe ingredients"),
		// check("instructions")
		// 	.not()
		// 	.isEmpty()
		// 	.withMessage("Add recipe instructions"),
		// check("image")
		// 	.not()
		// 	.isEmpty()
		// 	.withMessage("Must be a valid image"),
		// check("feeds")
		// 	.isNumeric()
		// 	.withMessage("Add feeds amount"),
		// check("url")
		// 	.not()
		// 	.isEmpty()
		// 	.withMessage("Must be a valid URL"),
		// check("cost")
		// 	.isDecimal()
		// 	.withMessage("Invalid cost"),
		// check("price")
		// 	.isDecimal()
		// 	.withMessage("Invalid price"),
	],
	addRecipe
);

router.patch(
	"/edit/:recipeId",
	// fileUpload.single("image"),
	[
		check("category")
			.not()
			.isEmpty()
			.withMessage("Add category"),
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add recipe name"),
		check("description")
			.not()
			.isEmpty()
			.withMessage("Add recipe description"),
		check("ingredients")
			.not()
			.isEmpty()
			.withMessage("Add recipe ingredients"),
		check("instructions")
			.not()
			.isEmpty()
			.withMessage("Add recipe instructions"),
		check("image")
			.not()
			.isEmpty()
			.withMessage("Must be a valid image"),
		check("feeds")
			.isNumeric()
			.withMessage("Add feeds amount"),
		check("url")
			.not()
			.isEmpty()
			.withMessage("Must be a valid URL"),
		check("cost")
			.isDecimal()
			.withMessage("Invalid cost"),
		check("premium")
			.isNumeric()
			.withMessage("Add premium"),
		check("price")
			.isDecimal()
			.withMessage("Invalid price"),
	],
	editRecipe
);
router.post(
	"/new/ingredient/",
	[
		check("category")
			.not()
			.isEmpty()
			.withMessage("Add category"),
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add recipe name"),
		check("description")
			.not()
			.isEmpty()
			.withMessage("Add recipe description"),
		check("ingredients")
			.not()
			.isEmpty()
			.withMessage("Add recipe ingredients"),
		check("instructions")
			.not()
			.isEmpty()
			.withMessage("Add recipe instructions"),
		check("image")
			.not()
			.isEmpty()
			.withMessage("Must be a valid image"),
		check("feeds")
			.isNumeric()
			.withMessage("Add feeds amount"),
		check("url")
			.not()
			.isEmpty()
			.withMessage("Must be a valid URL"),
		check("cost")
			.isDecimal()
			.withMessage("Invalid cost"),
		check("premium")
			.isNumeric()
			.withMessage("Add premium"),
		check("price")
			.isDecimal()
			.withMessage("Invalid price"),
	]
	// addRecipeIngredient
);

router.delete("/delete/:recipeId", deleteRecipe);

module.exports = router;
