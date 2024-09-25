const express = require("express");
const { check } = require("express-validator");

const {
	getCustomerList,
	getCustomerById,
	addCustomer,
	editCustomer,
	deleteCustomer,
} = require("../controllers/customers-controller");

const router = express.Router();

router.get("/list", getCustomerList);
router.get("/:customerId", getCustomerById);
router.post(
	"/new",
	[
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add customer name"),
	],
	addCustomer
);

router.patch(
	"/edit/:customerId",
	[
		check("name")
			.not()
			.isEmpty()
			.withMessage("Add customer name"),
	],
	editCustomer
);

router.delete("/delete/:customerId", deleteCustomer);

module.exports = router;
