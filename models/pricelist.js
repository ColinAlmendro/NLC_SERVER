const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const priceListSchema = new Schema({
	item: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Pricelist", priceListSchema);
