const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Ingredient = require("../models/ingredient");
const Recipe = require("../models/recipe");

///////////////////////////////////////////////////////////////////
const getIngredientList = async (req, res, next) => {
	let ingredientList;
	try {
		ingredientList = await Ingredient.find().sort({category:1});
	} catch (err) {
		const error = new HttpError(
			"Fetching ingredients failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!ingredientList || ingredientList.length === 0) {
		return next(new HttpError("Could not find any ingredients.", 404));
	}
	res.json({
		ingredients: ingredientList.map((ingredient) =>
			ingredient.toObject({ getters: true })
		),
	});
};

////////////////////////////////////////////////////
const getIngredientById = async (req, res, next) => {
	const ingredientId = req.params.ingredientId;
	let ingredient;
	try {
		ingredient = await Ingredient.findById(ingredientId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find ingredient.",
			500
		);
		return next(error);
	}

	if (!ingredient) {
		const error = new HttpError(
			"Could not find ingredient for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ ingredient: ingredient.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addIngredient = async (req, res, next) => {
	console.log("Node req body* ", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("validation error: " + errors.message);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const { category, name, description, price } = req.body;
	
	const newIngredient = new Ingredient({
		category,
		name,
		description,
		price,
	});
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newIngredient.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			// "Adding ingredient failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ ingredient: newIngredient });
};
////////////////////////////////////////////////
const editIngredient = async (req, res, next) => {
	console.log("ing req",req);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}
	const { category, name, description, unit, volume, price } = req.body;
	const ingredientId = req.params.ingredientId;

	let ingredient;
	try {
		ingredient = await Ingredient.findById(ingredientId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not edit ingredient.",
			500
		);
		return next(error);
	}

	ingredient.category = category;
	ingredient.name = name;
	ingredient.description = description;
	ingredient.price = price;

	try {
		await ingredient.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update ingredient.",
			500
		);
		return next(error);
	}

	res.status(200).json({ ingredient: ingredient.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteIngredient = async (req, res, next) => {
	const ingredientId = req.params.ingredientId;
	console.log("ID:", ingredientId);

	// Is ingredient still used in a recipe?
	try {
		const recipe = await Recipe.findOne({ ingredients: ingredientId })
			.lean()
			.exec();
		if (recipe) {
			//console.log("Recipes:", recipe);

			const error = new HttpError(
				`Ingredient still linked to recipe ${recipe.name}`,
				404
			);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}
	//not linked so carry on and delete
	try {
		const deletedItem = await Ingredient.findByIdAndDelete(ingredientId, {
			new: true,
		});
		if (deletedItem) {
			console.log("Ingredient to be deleted:", deletedItem);
		} else {
			console.log("No ingredient found with that id.");
			const error = new HttpError("No ingredient found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted ingredient." });
};

module.exports = {
	getIngredientById,
	getIngredientList,
	addIngredient,
	editIngredient,
	deleteIngredient,
};
