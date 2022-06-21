const express = require("express");

const authRoute = express.Router();

const authController = require("../controllers/authController");


// RESTAURANT
authRoute.post("/login/restaurant", authController.loginRestaurant);

authRoute.post("/register/restaurant", authController.registerRestaurant);

// CUSTOMER
authRoute.post("/register/customer", authController.registerCustomer);
authRoute.post("/login/customer", authController.loginCustomer);

module.exports = authRoute;
