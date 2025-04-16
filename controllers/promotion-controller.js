const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Promotion = require("../models/promotion");

///////////////////////////////////////////////////////////////////
const getPromotionList = async (req, res, next) => {
	let promotionList;
	try {
		promotionList = await Promotion.find()
			.populate({
				path: "items.recipe",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			.sort({ name: 1 })
			.exec();
	} catch (err) {
		const error = new HttpError(
			"Fetching promotions failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!promotionList || promotionList.length === 0) {
		return next(new HttpError("Could not find any promotions.", 404));
	}
	res.json({
		promotions: promotionList.map((promotion) =>
			promotion.toObject({ getters: true })
		),
	});
};

////////////////////////////////////////////////////
const getPromotionById = async (req, res, next) => {
	const promotionId = req.params.promotionId;
	let promotion;
	try {
		promotion = await Promotion.findById(promotionId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find promotion.",
			500
		);
		return next(error);
	}

	if (!promotion) {
		const error = new HttpError(
			"Could not find promotion for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ promotion: promotion.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addPromotion = async (req, res, next) => {
	//console.log("req body** ", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//console.log("validation error: " + errors.message);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	//const { type, category, name, description, recipe, cost, price } = req.body;
	//console.log("req body** ", req.body);
	const newPromotion = new Promotion({
		promotion: req.body.promotion,
		items: req.body.items,
	});
	//console.log(recipe);
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newPromotion.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding promotion failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ promotion: newPromotion });
};
////////////////////////////////////////////////
const editPromotion = async (req, res, next) => {
	//console.log("Body:", req.params.promotionId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}
	// const { type, category, name, description, recipe, cost, price } = req.body;
	const promotionId = req.params.promotionId;

	let promotion;
	try {
		promotion = await Promotion.findById(promotionId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find promotion.",
			500
		);
		return next(error);
	}
	//console.log("Orig promotion:", promotion);
	promotion.promotion = req.body.promotion;
	promotion.items = req.body.items;

	try {
		await promotion.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update promotion.",
			500
		);
		return next(error);
	}

	//////
	res.status(200).json({ promotion: promotion.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deletePromotion = async (req, res, next) => {
	const promotionId = req.params.promotionId;
	//console.log("ID:", promotionId);

	try {
		const deletedItem = await Promotion.findByIdAndDelete(promotionId, {
			new: true,
		});
		if (deletedItem) {
			//console.log("Promotion to be deleted:", deletedItem);
		} else {
			//console.log("No promotion found with that id.");
			const error = new HttpError("No promotion found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted promotion." });
};

module.exports = {
	getPromotionById,
	getPromotionList,
	addPromotion,
	editPromotion,
	deletePromotion,
};
