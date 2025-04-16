const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
	category: { type: String, required: true },
	name: { type: String,  required: true },
	description: { type: String, required: false },
	// unit: { type: String, default: "gram" },
	// volume: { type: Number, required: true },
	price: { type: Number, "multipleOf" : 0.01, required: true },
});


module.exports = mongoose.model("Ingredient", ingredientSchema);
