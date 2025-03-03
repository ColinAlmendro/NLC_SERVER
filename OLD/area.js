const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const areaSchema = new Schema({
	area: { type: String, required: true },
	delivery_rate: { type: String, required: true },
});

areaSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Area", areaSchema);
