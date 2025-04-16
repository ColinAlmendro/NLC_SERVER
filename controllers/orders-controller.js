const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Order = require("../models/order");
const Recipe = require("../models/recipe");

///////////////////////////////////////////////////////////////////
const getOrderList = async (req, res, next) => {
	//console.log("Abholung vom orders")
	let orderList;
	try {
		orderList = await Order.find()
			.populate({
				path: "customer",
				//  select: "name",
				model: "Customer",
			})
			.populate({
				path: "menu",
				select: "date",
				model: "Menu",
			})
			.sort({ date: -1, name: 1 })
			.exec();
	} catch (err) {
		const error = new HttpError(
			"Fetching orders failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!orderList || orderList.length === 0) {
		return next(new HttpError("Could not find any orders.", 404));
	}
	res.json({
		orders: orderList.map((order) => order.toObject({ getters: true })),
	});
};

////////////////////////////////////////////////////
const getOrderById = async (req, res, next) => {
	const orderId = req.params.orderId;
	let order;
	try {
		order = await Order.findById(orderId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find order.",
			500
		);
		return next(error);
	}

	if (!order) {
		const error = new HttpError(
			"Could not find order for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ order: order.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addOrder = async (req, res, next) => {
	console.log("req body** ", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new HttpError(
			`Invalid input, please check your data, ${errors}`,
			422
		);
	}
	// update recipe count !!!!!!!!!!!!!!!!!!!!!
	let recipeCount;
	req.body.monday &&
		req.body.monday.map(async (item) => {
			//console.log("monday item", item)
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});
	req.body.tuesday &&
		req.body.tuesday.map(async (item) => {
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});
	req.body.wednesday &&
		req.body.wednesday.map(async (item) => {
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});
	req.body.thursday &&
		req.body.thursday.map(async (item) => {
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});
	req.body.friday &&
		req.body.friday.map(async (item) => {
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});
	req.body.frozen &&
		req.body.friday.map(async (item) => {
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});
	req.body.promotions &&
		req.body.promotions.map(async (item) => {
			recipeCount = await Recipe.updateOne(
				{ _id: item.item },
				{ $inc: { orders: item.count } },
				{ upsert: true }
			);
		});

	const newOrder = new Order({
		date: req.body.date,
		customer: req.body.customer,
		menu: req.body.menu,
		monday: req.body.monday,
		tuesday: req.body.tuesday,
		wednesday: req.body.wednesday,
		thursday: req.body.thursday,
		friday: req.body.friday,
		frozen: req.body.frozen,
		promotion: req.body.promotion,
		item_count: req.body.item_count,
		total_cost: req.body.total_cost,
		total_delivery: req.body.total_delivery,
		total_price: req.body.total_price,
		note: req.body.note,
	});
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newOrder.save({
			session: sess,
		});
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding order failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ order: newOrder });
};
////////////////////////////////////////////////
const editOrder = async (req, res, next) => {
	//	console.log("order_controller", req.params.orderId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const orderId = req.params.orderId;

	let order;
	try {
		order = await Order.findById(orderId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not edit order.",
			500
		);
		return next(error);
	}

	order.date = req.body.date;
	order.date = req.body.date;
	order.customer = req.body.customer;
	order.menu = req.body.menu;
	order.monday = req.body.monday;
	order.tuesday = req.body.tuesday;
	order.wednesday = req.body.wednesday;
	order.thursday = req.body.thursday;
	order.friday = req.body.friday;
	order.frozen = req.body.frozen;
	order.promotion = req.body.promotion;
	order.item_count = req.body.item_count;
	order.total_cost = req.body.total_cost;
	order.total_delivery = req.body.total_delivery;
	order.total_price = req.body.total_price;
	order.note = req.body.note;

	try {
		await order.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update order.",
			500
		);
		return next(error);
	}

	res.status(200).json({ order: order.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteOrder = async (req, res, next) => {
	const orderId = req.params.orderId;

	//console.log("OrderId", orderId);

	try {
		const deletedItem = await Order.findByIdAndDelete(orderId, {
			new: true,
		});
		if (deletedItem) {
		//	console.log("Order to be deleted:", deletedItem);
		} else {
		//	console.log("No order found with that id.");
			const error = new HttpError("No order found with that id.", 404);
			return next(error);
		}
	} catch (error) {
		console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted order." });
};

module.exports = {
	getOrderById,
	getOrderList,
	addOrder,
	editOrder,
	deleteOrder,
};
