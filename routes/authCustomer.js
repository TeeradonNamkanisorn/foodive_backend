const express = require("express");
const authCustomerController = require("../controllers/authCustomerController");
const router = express.Router();

router.post("/signup", authCustomerController.signup);
