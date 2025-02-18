const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
	promotion: { type: String, required: true },
	items: [
		{
			image: { type: String, required: false },
			recipe: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			name: { type: String, required: true },
			description: { type: String, required: true },
			volume: { type: String, required: true },
			count: { type: Number, required: true },
			price: { type: Number, multipleOf: 0.01, required: true },
		},
	],
});
module.exports = mongoose.model("Promotion", promotionSchema);
