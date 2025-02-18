const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const areaSchema = new Schema({
	area: { type: String, required: true },
	delivery_km: { type: Number, multipleOf: 0.01, required: true },
});
const recipeTypeSchema = new Schema({
	//label: { type: String, required: true },
	value: { type: String, required: true },
});
const ingredientCategorySchema = new Schema({
	//label: { type: String, required: true },
	value: { type: String, required: true },
});
const priceListSchema = new Schema({
	//label: { type: String, required: true },
	value: { type: String, required: true },
});

const appSettingSchema = new Schema({
	app_title: { type: String, required: false },
	app_logo: { type: String, required: false },
	home_logo: { type: String, required: false },
	home_bg_image: { type: String, required: false },
	footer_about: { type: String, required: false },
	contact_location: { type: String, required: false },
	contact_name: { type: String, required: false },
	contact_email: { type: String, required: false },
	contact_cellphone: { type: String, required: false },
	facebook: { type: String, required: false },
	instagram: { type: String, required: false },
	menu_logo: { type: String, required: false },
	menu_image: { type: String, required: false },
	about_intro: { type: String, required: false },
	about_text: { type: String, required: false },
	about_image: { type: String, required: false },
	area_list: [areaSchema],
	recipe_type_list: [recipeTypeSchema],
	ingredient_category_list: [ingredientCategorySchema],
	price_list: [priceListSchema],
	aa_rate: { type: Number, multipleOf: 0.01, required: true },
});

appSettingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("AppSetting", appSettingSchema);
