const express = require("express");

const authRoute = express.Router();

const authController = require("../controllers/authController");
const authCustomerController = require("../controllers/authCustomerController");

// RESTAURANT
authRoute.post("/login/restaurant");

authRoute.post("/register/restaurant", authController.registerRestaurant);

// CUSTOMER
authRoute.post("/register/customer", authCustomerController.signup);

authRoute.post("/register/customer", authCustomerController.login);

module.exports = authRoute;
