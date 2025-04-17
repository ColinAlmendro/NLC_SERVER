const fs = require("fs");
const path = require("path");
const compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const appSettingsRoutes = require("./routes/app_settings-routes");
const usersRoutes = require("./routes/users-routes");
const ingredientsRoutes = require("./routes/ingredients-routes");
const recipesRoutes = require("./routes/recipes-routes");
const promotionsRoutes = require("./routes/promotions-routes");
const customersRoutes = require("./routes/customers-routes");
const ordersRoutes = require("./routes/orders-routes");
// const pricelistRoutes = require("./routes/pricelist-routes");
const menusRoutes = require("./routes/menus-routes");
//const areasRoutes = require("./OLD/areas-routes");

const httpError = require("./models/http-error");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(compression());


// const url =
// 	"mongodb+srv://NLC_admin:" +
// 	encodeURIComponent("CappucinoIsTheBest") +
// 	"@cluster0.fbflozx.mongodb.net/NLC?retryWrites=true&w=majority";

const url = process.env.MONGO_CONNECT;

app.use(
	cors({
		origin: "*",
	})
);

/////////////////////////////
// app.use(bodyParser.urlencoded({extended : true}));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: "50mb",
		parameterLimit: 50000,
	})
);
app.use("/api/users", usersRoutes);
app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/orders", ordersRoutes);

app.use("/api/menus", menusRoutes);
app.use("/api/promotions", promotionsRoutes);

app.use("/api/appsettings", appSettingsRoutes);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

//CORS headers

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
	next();
});

app.use((req, res, next) => {
	const error = new httpError("Could not find this route", 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log("APP req.file error", err);
		});
	}
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "An unknown error occurred!" });
});
////////////////////////////

mongoose
	.connect(url)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("MongoDB connection failed: " + err);
		process.exit(1);
	});
