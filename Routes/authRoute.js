const express = require('express');

const authRoute = express.Router();

const authController = require('../controllers/authController');


authRoute.post('/login/restaurant');

authRoute.post('/register/restaurant', authController.registerRestaurant)

module.exports = authRoute;