const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Menu = require("../models/menu");

///////////////////////////////////////////////////////////////////
const getMenuList = async (req, res, next) => {
	//console.log("Abholung vom menus")
	let menuList;
	try {
		menuList = await Menu.find()
			.populate({
				path: "monday.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			// .populate({
			// 	path: "monday.side",
			// 	select: ["category", "name", "premium"],
			// 	model: "Recipe",
			// })
			.populate({
				path: "tuesday.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			// .populate({
			// 	path: "tuesday.side",
			// 	select: ["category", "name"],
			// 	model: "Recipe",
			// })
			.populate({
				path: "wednesday.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			// .populate({
			// 	path: "wednesday.side",
			// 	select: ["category", "name"],
			// 	model: "Recipe",
			// })
			.populate({
				path: "thursday.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			// .populate({
			// 	path: "thursday.side",
			// 	select: ["category", "name"],
			// 	model: "Recipe",
			// })
			.populate({
				path: "friday.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			// .populate({
			// 	path: "friday.side",
			// 	select: ["category", "name"],
			// 	model: "Recipe",
			// })
			.populate({
				path: "vegies.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			.populate({
				path: "salads.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			.populate({
				path: "soups.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			.populate({
				path: "sides.main",
				select: ["category", "name", "premium"],
				model: "Recipe",
			})
			.exec();
	} catch (err) {
		const error = new HttpError(
			"Fetching menus failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!menuList || menuList.length === 0) {
		return next(new HttpError("Could not find any menus.", 404));
	}
	res.json({
		menus: menuList.map((menu) => menu.toObject({ getters: true })),
	});
};

////////////////////////////////////////////////////
const getMenuById = async (req, res, next) => {
	const menuId = req.params.menuId;
	let menu;
	try {
		menu = await Menu.findById(menuId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find menu.",
			500
		);
		return next(error);
	}

	if (!menu) {
		const error = new HttpError(
			"Could not find menu for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ menu: menu.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addMenu = async (req, res, next) => {
	//	console.log("req body** ", req.params.menuId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError(
			`Invalid input, please check your data, ${errors}`,
			422
		);
	}

	const newMenu = new Menu({
		date: req.body.date,
		introduction: req.body.introduction,
		promotion: req.body.promotion,
		monday: req.body.monday,
		tuesday: req.body.tuesday,
		wednesday: req.body.wednesday,
		thursday: req.body.thursday,
		friday: req.body.friday,
		vegies: req.body.vegies,
		salads: req.body.salads,
		soups: req.body.soups,
		sides: req.body.sides,
	});
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newMenu.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding menu failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ menu: newMenu });
};
////////////////////////////////////////////////
const editMenu = async (req, res, next) => {
	//	console.log("menu_controller", req.params.menuId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const menuId = req.params.menuId;

	let menu;
	try {
		menu = await Menu.findById(menuId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not edit menu.",
			500
		);
		return next(error);
	}

	menu.date = req.body.date;
	menu.introduction = req.body.introduction;
	menu.promotion = req.body.promotion;
	menu.monday = req.body.monday;
	menu.tuesday = req.body.tuesday;
	menu.wednesday = req.body.wednesday;
	menu.thursday = req.body.thursday;
	menu.friday = req.body.friday;
	menu.vegies = req.body.vegies;
	menu.salads = req.body.salads;
	menu.soups = req.body.soups;
	menu.sides = req.body.sides;

	try {
		await menu.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update menu.",
			500
		);
		return next(error);
	}

	res.status(200).json({ menu: menu.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteMenu = async (req, res, next) => {
	const menuId = req.params.menuId;

	//console.log("MenuId", menuId);

	try {
		const deletedItem = await Menu.findByIdAndDelete(menuId, {
			new: true,
		});
		if (deletedItem) {
			console.log("Menu to be deleted:", deletedItem);
		} else {
			console.log("No menu found with that id.");
			const error = new HttpError("No menu found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted menu." });
};

module.exports = {
	getMenuById,
	getMenuList,
	addMenu,
	editMenu,
	deleteMenu,
};
