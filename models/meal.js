const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealSchema = new Schema({
	type: { type: String, default: "Main" },
	category: { type: [String], required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	recipe: {
		type: Schema.Types.ObjectId,
		ref: "Recipes",
		required: false,
	},
	image: { type: String, required: false },
	cost: mongoose.Decimal128,
	price: mongoose.Decimal128,
});

module.exports = mongoose.model("Meal", mealSchema);
