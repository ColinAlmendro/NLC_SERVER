const express = require("express");
const { check } = require("express-validator");

const {
	getOrderList,
	getOrderById,
	addOrder,
	editOrder,
	deleteOrder,
} = require("../controllers/orders-controller");

const router = express.Router();

router.get("/list", getOrderList);
router.get("/:orderId", getOrderById);
router.post(
	"/new",
	[
		check("date")
			.not()
			.isEmpty(),
		check("customer")
			.not()
			.isEmpty(),
		check("menu")
			.not()
			.isEmpty(),
		check("monday")
			.not()
			.isEmpty(),
		check("tuesday")
			.not()
			.isEmpty(),
		check("wednesday")
			.not()
			.isEmpty(),
		check("thursday")
			.not()
			.isEmpty(),
		check("friday")
			.not()
			.isEmpty(),
	],
	addOrder
);

router.patch(
	"/edit/:orderId",
	[
		check("date")
			.not()
			.isEmpty(),
		check("customer")
			.not()
			.isEmpty(),
		check("menu")
			.not()
			.isEmpty(),
		check("monday")
			.not()
			.isEmpty(),
		check("tuesday")
			.not()
			.isEmpty(),
		check("wednesday")
			.not()
			.isEmpty(),
		check("thursday")
			.not()
			.isEmpty(),
		check("friday")
			.not()
			.isEmpty(),
	],
	editOrder
);

router.delete("/delete/:orderId", deleteOrder);

module.exports = router;
