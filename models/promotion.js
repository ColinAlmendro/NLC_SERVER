const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
	promotion: { type: String, required: true },
	items: [
		{
			image: { type: String, required: false },
			name: { type: String, required: true },
			description: { type: String, required: true },
			volume: { type: String, required: true },
			price: { type: String, required: true },
			// price: mongoose.Decimal128,
		},
	],
});
module.exports = mongoose.model("Promotion", promotionSchema);
