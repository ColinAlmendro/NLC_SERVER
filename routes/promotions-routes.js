const express = require("express");
const { check } = require("express-validator");

const {
	getPromotionList,
	getPromotionById,
	addPromotion,
	editPromotion,
	deletePromotion,
} = require("../controllers/promotion-controller");

const router = express.Router();

router.get("/list", getPromotionList);
router.get("/:promotionId", getPromotionById);
router.post(
	"/new",
	[
		check("promotion")
			.not()
			.isEmpty()
			.withMessage("Add promotion name"),
	],
	addPromotion
);

router.patch(
	"/edit/:promotionId",
	[
		check("promotion")
			.not()
			.isEmpty()
			.withMessage("Add promotion name"),
	],
	editPromotion
);

router.delete("/delete/:promotionId", deletePromotion);

module.exports = router;
