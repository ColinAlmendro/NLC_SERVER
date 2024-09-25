const express = require("express");
const { check } = require("express-validator");

const {
	getPricelistList,
	getPricelistById,
	addPricelist,
	editPricelist,
	deletePricelist,
} = require("../controllers/pricelist-controller");

const router = express.Router();

router.get("/list", getPricelistList);
router.get("/:pricelistId", getPricelistById);
router.post(
	"/new",
	[
		check("item")
			.not()
			.isEmpty()
			.withMessage("Add pricelist item"),
	],
	addPricelist
);

router.patch(
	"/edit/:pricelistId",
	[
		check("item")
			.not()
			.isEmpty()
			.withMessage("Add pricelist item"),
	],
	editPricelist
);

router.delete("/delete/:pricelistId", deletePricelist);

module.exports = router;
