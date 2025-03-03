const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Area = require("./area");

///////////////////////////////////////////////////////////////////
const getAreaList = async (req, res, next) => {
	let areaList;
	try {
		areaList = await Area.find().sort({ area: 1 });
	} catch (err) {
		const error = new HttpError(
			"Fetching areas failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!areaList || areaList.length === 0) {
		return next(new HttpError("Could not find any areas.", 404));
	}
	res.json({
		areas: areaList.map((area) => area.toObject({ getters: true })),
	});
};

////////////////////////////////////////////////////
const getAreaById = async (req, res, next) => {
	const areaId = req.params.areaId;
	let area;
	try {
		area = await Area.findById(areaId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find area.",
			500
		);
		return next(error);
	}

	if (!area) {
		const error = new HttpError(
			"Could not find area for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ area: area.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addArea = async (req, res, next) => {
	console.log("req body** ", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("validation error: " + errors.message);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const newArea = new Area({
		area: req.body.area,
		delivery_rate: req.body.delivery_rate,
	});

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newArea.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding area failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ area: newArea });
};
////////////////////////////////////////////////
const editArea = async (req, res, next) => {
	console.log("Body:", req.params.areaId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const areaId = req.params.areaId;

	let area;
	try {
		area = await Area.findById(areaId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find area.",
			500
		);
		return next(error);
	}

	area.area = req.body.area;
	area.delivery_rate = req.body.delivery_rate;

	try {
		await area.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update area.",
			500
		);
		return next(error);
	}

	//////
	res.status(200).json({ area: area.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteArea = async (req, res, next) => {
	const areaId = req.params.areaId;
	console.log("ID:", areaId);

	try {
		const deletedItem = await Area.findByIdAndDelete(areaId, {
			new: true,
		});
		if (deletedItem) {
			console.log("Area to be deleted:", deletedItem);
		} else {
			console.log("No area found with that id.");
			const error = new HttpError("No area found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted area." });
};

module.exports = {
	getAreaById,
	getAreaList,
	addArea,
	editArea,
	deleteArea,
};
