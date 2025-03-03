const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Pricelist = require("../models/pricelist");
const Recipe = require("../models/recipe");

///////////////////////////////////////////////////////////////////
const getPricelistList = async (req, res, next) => {
	let pricelistList;
	try {
		pricelistList = await Pricelist.find();
	} catch (err) {
		const error = new HttpError(
			"Fetching pricelist failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!pricelistList || pricelistList.length === 0) {
		return next(new HttpError("Could not find any pricelist.", 404));
	}
	res.json({
		pricelists: pricelistList.map((pricelist) =>
			pricelist.toObject({ getters: true })
		),
	});
};

////////////////////////////////////////////////////
const getPricelistById = async (req, res, next) => {
	const pricelistId = req.params.pricelistId;
	let pricelist;
	try {
		pricelist = await Pricelist.findById(pricelistId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find pricelist.",
			500
		);
		return next(error);
	}

	if (!pricelist) {
		const error = new HttpError(
			"Could not find pricelist for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ pricelist: pricelist.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addPricelist = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("validation error: " + errors.message);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const { item } = req.body;
	const newPricelist = new Pricelist({
		item,
	});

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newPricelist.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding pricelist failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ pricelist: newPricelist });
};
////////////////////////////////////////////////
const editPricelist = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}
	const { item } = req.body;
	const pricelistId = req.params.pricelistId;

	let pricelist;
	try {
		pricelist = await Pricelist.findById(pricelistId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find pricelist.",
			500
		);
		return next(error);
	}
	pricelist.item = item;

	try {
		await pricelist.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update pricelist.",
			500
		);
		return next(error);
	}

	//////
	res.status(200).json({ pricelist: pricelist.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deletePricelist = async (req, res, next) => {
	const pricelistId = req.params.pricelistId;

	try {
		const deletedItem = await Pricelist.findByIdAndDelete(pricelistId, {
			new: true,
		});
		if (deletedItem) {
			console.log("Pricelist to be deleted:", deletedItem);
		} else {
			console.log("No pricelist found with that id.");
			const error = new HttpError("No pricelist found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted pricelist." });
};

module.exports = {
	getPricelistById,
	getPricelistList,
	addPricelist,
	editPricelist,
	deletePricelist,
};
