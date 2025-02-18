const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, unique: true, required: true },
	email: { type: String, required: true, unique: true },
	// image: { type: String, required: false },
	// cloudinary_id: { type: String, required: false },
	password: { type: String, required: true, minlength: 6 },
	admin: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
