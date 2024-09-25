const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
	date: { type: Date, required: true },
	// logo: { type: String, required: false },
	// image: { type: String, required: false },
	// contact: { type: String, required: true },
	introduction: { type: String, required: true },
	promotion: { type: String, required: false },
	// instruction: { type: String, required: true },
	// prices: [String],
	monday: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
			side: { type: String, required: false },
			sidename: { type: String, required: false },
			sidedescription: { type: String, required: false },
		},
	],
	tuesday: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
			side: { type: String, required: false },
			sidename: { type: String, required: false },
			sidedescription: { type: String, required: false },
		},
	],
	wednesday: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
			side: { type: String, required: false },
			sidename: { type: String, required: false },
			sidedescription: { type: String, required: false },
		},
	],
	thursday: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
			side: { type: String, required: false },
			sidename: { type: String, required: false },
			sidedescription: { type: String, required: false },
		},
	],
	friday: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
			side: { type: String, required: false },
			sidename: { type: String, required: false },
			sidedescription: { type: String, required: false },
		},
	],
	vegies: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
		},
	],
	salads: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
		},
	],
	soups: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
		},
	],
	sides: [
		{
			image: { type: String, required: false },
			main: { type: String, required: false },
			mainname: { type: String, required: false },
			maindescription: { type: String, required: false },
		},
	],
	// note: { type: String, required: true },
});

module.exports = mongoose.model("Menu", menuSchema);
