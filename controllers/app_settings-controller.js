const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const AppSettings = require("../models/app_setting");

///////////////////////////////////////////////////////////////////
const getAppSettings = async (req, res, next) => {
	// const settingId = req.params.settingId;

	let settings;
	try {
		settings = await AppSettings.find();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find settings.",
			500
		);
		return next(error);
	}

	if (!settings || settings.length === 0) {
		return next(new HttpError("Could not find any settings.", 404));
	}
	res.json({
		settings: settings.map((setting) => setting.toObject({ getters: true })),
	});
};
//////////////////////////////////////////////
const editAppSettings = async (req, res, next) => {
//	console.log("editAppSettings", req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid input, please check your data", 422);
	}
	const {
		app_title,
		app_subtitle,
		app_logo,
		home_logo,
		home_bg_image,
		footer_about,
		contact_location,
		contact_name,
		contact_email,
		contact_cellphone,
		facebook,
		instagram,
		menu_logo,
		menu_image,
		about_intro,
		about_text,
		about_image,
		area_list,
		recipe_type_list,
		ingredient_category_list,
		price_list,
		aa_rate,
	} = req.body;

	 const appSettingId = req.params.appSettingId;
// console.log("appSettingId", appSettingId);
	let appSettings;
	try {
		appSettings = await AppSettings.findById(appSettingId);
	} catch (err) {
	//	console.log("err1",err)
		const error = new HttpError(
			"Something went wrong, could not edit app settings.",
			500
		);
		return next(error);
	}


	appSettings.app_title = app_title;
	appSettings.app_subtitle = app_subtitle;
	appSettings.app_logo = app_logo;

	appSettings.home_logo = home_logo;
	appSettings.home_bg_image = home_bg_image;

	appSettings.footer_about = footer_about;
	appSettings.contact_location = contact_location;
	appSettings.contact_name = contact_name;
	appSettings.contact_email = contact_email;
	appSettings.contact_cellphone = contact_cellphone;

	appSettings.facebook = facebook;
	appSettings.instagram = instagram;

	appSettings.menu_logo = menu_logo;
	appSettings.menu_image = menu_image;

	appSettings.about_intro = about_intro;
	appSettings.about_text = about_text;
	appSettings.about_image = about_image;
	appSettings.area_list = area_list;
    appSettings.recipe_type_list = recipe_type_list;
    appSettings.ingredient_category_list = ingredient_category_list;
	appSettings.price_list = price_list;
	appSettings.aa_rate = aa_rate;

	try {
		await appSettings.save();
	} catch (err) {
		//console.log("errsave", err);
		const error = new HttpError(
			"Something went wrong, could not update app settings.",
			500
		);
		return next(error);
	}

	res
		.status(200)
		.json({ appSettings: appSettings.toObject({ getters: true }) });
};
////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////

module.exports = {
	getAppSettings,
	editAppSettings,
};
