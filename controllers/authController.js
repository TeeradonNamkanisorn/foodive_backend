const {Restaurant} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('../services/createError');
require('dotenv').config()

//Only for register with email/password
exports.registerRestaurant = async (req, res, next) => {
    try {

        
        const {name, latitude, longitude, email, password, telephoneNumber } = req.body;

        const token = jwt.sign({email, role: "restaurant"}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES
        });
        
        const hashedPw = await bcrypt.hash(password,10);
    
        await Restaurant.create({name, latitude, longitude, email, password: hashedPw, telephoneNumber})
        
        res.json({token})
    
    } catch (err) {
        next(err)
    }
}

