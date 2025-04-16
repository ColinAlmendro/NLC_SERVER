const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Customer = require("../models/customer");

///////////////////////////////////////////////////////////////////
const getCustomerList = async (req, res, next) => {
	let customerList;
	try {
		customerList = await Customer.find().sort({ surname: 1, name: 1 });
	} catch (err) {
		const error = new HttpError(
			"Fetching customers failed, please try again later.",
			500
		);
		return next(error);
	}
	if (!customerList || customerList.length === 0) {
		return next(new HttpError("Could not find any customers.", 404));
	}
	res.json({
		customers: customerList.map((customer) =>
			customer.toObject({ getters: true })
		),
	});
};

////////////////////////////////////////////////////
const getCustomerById = async (req, res, next) => {
	const customerId = req.params.customerId;
	let customer;
	try {
		customer = await Customer.findById(customerId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find customer.",
			500
		);
		return next(error);
	}

	if (!customer) {
		const error = new HttpError(
			"Could not find customer for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ customer: customer.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
const addCustomer = async (req, res, next) => {
//	console.log("req body** ", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//console.log("validation error: " + errors.message);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const newCustomer = new Customer({
		name: req.body.name,
		surname: req.body.name,
		dob: req.body.dob,
		cell: req.body.cell,
		email: req.body.email,
		address1: req.body.address1,
		area: req.body.area,
		note: req.body.note,
	});

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await newCustomer.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Adding customer failed, please try again.",
			err,
			500
		);
		return next(error);
	}

	res.status(201).json({ customer: newCustomer });
};
////////////////////////////////////////////////
const editCustomer = async (req, res, next) => {
	//console.log("Body:", req.params.customerId, req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}

	const customerId = req.params.customerId;

	let customer;
	try {
		customer = await Customer.findById(customerId);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find customer.",
			500
		);
		return next(error);
	}

	customer.name = req.body.name;
	customer.surname = req.body.surname;
	customer.dob = req.body.dob;
	customer.cell = req.body.cell;
	customer.email = req.body.email;
	customer.address1 = req.body.address1;
	customer.area = req.body.area;
	customer.note = req.body.note;

	try {
		await customer.save();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not update customer.",
			500
		);
		return next(error);
	}

	//////
	res.status(200).json({ customer: customer.toObject({ getters: true }) });
};
/////////////////////////////////////////////////////////////////////////////////
const deleteCustomer = async (req, res, next) => {
	const customerId = req.params.customerId;
	//console.log("ID:", customerId);

	// DELETE linked USER ?

	try {
		const deletedItem = await Customer.findByIdAndDelete(customerId, {
			new: true,
		});
		if (deletedItem) {
			//console.log("Customer to be deleted:", deletedItem);
		} else {
			//console.log("No customer found with that id.");
			const error = new HttpError("No customer found with that id.", 404);
			return next(error);
		}
	} catch (error) {
	//console.error("Error:", error);
		return next(error);
	}

	res.status(200).json({ message: "Deleted customer." });
};

module.exports = {
	getCustomerById,
	getCustomerList,
	addCustomer,
	editCustomer,
	deleteCustomer,
};
