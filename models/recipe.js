const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
	ingredient: {
		type: Schema.Types.ObjectId,
		ref: "Ingredients",
		required: true,
	},
	unit: { type: String, required: true },
	qty: { type: Number, multipleOf: 0.01, required: true },
});

const recipeSchema = new Schema({
	category: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	ingredients: [ingredientSchema],
	instructions: { type: String, required: true },
	image: { type: String, required: false },
	feeds: { type: Number, required: true },
	url: { type: String, required: false },
	premium: { type: Number, required: true },
	cost: { type: Number, multipleOf: 0.01, required: true },
	price: { type: Number, multipleOf: 0.01, required: true },
});

module.exports = mongoose.model("Recipe", recipeSchema);
