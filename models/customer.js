const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	dob: { type: Date, required: false },
	cell: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	address1: { type: String, required: true },
	area: { type: String, required: true },

	note: { type: String, required: false },
});

customerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Customer", customerSchema);
