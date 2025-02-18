const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	date: { type: Date, required: true },
	customer: {
		type: Schema.Types.ObjectId,
		ref: "Customers",
		required: true,
	},
	menu: {
		type: Schema.Types.ObjectId,
		ref: "Menus",
		required: true,
	},
	monday: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots...
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	tuesday: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots..
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	wednesday: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots..
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	thursday: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots..
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	friday: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots..
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	frozen: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots..
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	promotion: [
		{
			item: {
				type: Schema.Types.ObjectId,
				ref: "Recipes",
				required: true,
			},
			category: { type: String, required: true }, //main,veg,side,salad,soup....
			description: { type: String, required: true }, // curry, carrots..
			premium: { type: Number, required: true }, // 0
			count: { type: Number, required: true }, // 1,2,3...
			cost: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
			price: { type: Number, multipleOf: 0.01, required: true }, //99,40,55...
		},
	],
	item_count: { type: Number, required: true },
	total_cost: { type: Number, multipleOf: 0.01, required: true },
	total_delivery: { type: Number, multipleOf: 0.01, required: true },
	total_price: { type: Number, multipleOf: 0.01, required: true },
	note: { type: String, required: false },
});

module.exports = mongoose.model("Order", orderSchema);
