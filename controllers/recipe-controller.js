const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const cloudinary = require("../utils/cloudinaryConfig");
const Recipe = require("../models/recipe");

///////////////////////////////////////////////////////////////////
const getRecipeList = async (req, res, next) => {
	let recipeList;
	try {
		recipeList = await Recipe.find()
			.populate({
				path: "ingredients.ingredient",
				select: "name",
				model: "Ingredient",
			})
			.exec();
	} catch (err) {
		const error = new HttpError(
			"Fetching recipes failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!recipeList || recipeList.length === 0) {
		return next(new HttpError("Could not find any recipes.", 404));
	}
	res.json({
		recipes: recipeList.map((recipe) => recipe.toObject({ getters: true })),
	});
};

////////////////////////////////////////////////////
const getRecipeById = async (req, res, next) => {
	const recipeId = req.params.recipeId;
	let recipe;
	try {
		recipe = await Recipe.findById(recipeId).populate("ingredients");
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find recipe.",
			500
		);
		return next(error);
	}

	if (!recipe) {
		const error = new HttpError(
			"Could not find recipe for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ recipe: recipe.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addRecipe = async (req, res, next) => {
	console.log("new Body:", req.body);
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log("validation error: " + errors.message);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	try {
		// Upload image to cloudinary
		//const result = await cloudinary.uploader.upload(req.file.path);

		const newRecipe = new Recipe({
			category: req.body.category,
			name: req.body.name,
			description: req.body.description,
			// ingredients: JSON.parse(req.body.ingredients),
			ingredients: req.body.ingredients,
			instructions: req.body.instructions,
			image: req.body.image,
			feeds: req.body.feeds,
			url: req.body.url,
			premium: req.body.premium,
			cost: req.body.cost,
			price: req.body.price,
		});

		// try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newRecipe.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding recipe failed, please try again.",
			err,
			500
		);
		return next(error);
	}
	res.status(201).json({ message: "New recipe added" });
	// res.status(201).json({ recipe: newRecipe});
};
////////////////////////////////////////////////

const editRecipe = async (req, res, next) => {
	console.log("edit Body:", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}
	const {
		category,
		name,
		description,
		ingredients,
		instructions,
		image,
		feeds,
		url,
		premium,
		cost,
		price,
	} = req.body;
	const recipeId = req.params.recipeId;

	let recipe;
	try {
		recipe = await Recipe.findById(recipeId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find recipe.",
			500
		);
		return next(error);
	}
	console.log("Orig recipe:", recipe);

	// try {
	// 	// Upload image to cloudinary
	// 	const result = await cloudinary.uploader.upload(req.file.path);

	recipe.category = category;
	recipe.name = name;
	recipe.description = description;
	recipe.ingredients = ingredients;
	recipe.instructions = instructions;
	recipe.image = image;
	recipe.feeds = feeds;
	recipe.url = url;
	recipe.premium = premium;
	recipe.cost = cost;
	recipe.price = price;

	try {
		await recipe.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update recipe.",
			500
		);
		return next(error);
	}

	//////
	res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteRecipe = async (req, res, next) => {
	const recipeId = req.params.recipeId;
	console.log("ID:", recipeId);

	try {
		const deletedItem = await Recipe.findByIdAndDelete(recipeId, {
			new: true,
		});
		if (deletedItem) {
			console.log("Recipe to be deleted:", deletedItem);
		} else {
			console.log("No recipe found with that id.");
			const error = new HttpError("No recipe found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted recipe." });
};

module.exports = {
	getRecipeById,
	getRecipeList,
	addRecipe,
	editRecipe,
	deleteRecipe,
};
