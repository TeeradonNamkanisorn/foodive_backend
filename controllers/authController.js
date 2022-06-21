const {Restaurant, Customer} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('../services/createError');
require('dotenv').config();

const { Op } = require('sequelize')

console.log(process.env.JWT_EXPIRES_IN)
const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//Only for register with email/password
exports.registerRestaurant = async (req, res, next) => {
    try {

        
        const {name, latitude, longitude, email, password, telephoneNumber, confirmPassword } = req.body;

        if (password !== confirmPassword) createError("invalid credentials", 400);

        
        const hashedPw = await bcrypt.hash(password,10);
        
        const token =  genToken({email});

        await Restaurant.create({name, latitude, longitude, email, password: hashedPw, telephoneNumber})
        
        res.status(201).json({ message: "sign up success" ,token})
    
    } catch (err) {
        next(err)
    }
}

exports.loginRestaurant = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        
        const restaurant = await Restaurant.findOne({where : {
            email
        }});

        const isCorrect = await bcrypt.compare( password, restaurant.password);

        if (!isCorrect) createError("invalid email or password", 400);

        const token = genToken({email});

        res.json({message: "Login success", token})

    } catch (err) {
        next(err)
    }
}


exports.registerCustomer = async (req, res, next) => {
    try {
      const { firstName, lastName, email, gmail, password, confirmPassword } =
        req.body;
  
      if (!email && gmail) {
      }
  
      if (!password) {
      }
  
      if (password !== confirmPassword) {
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const customer = await Customer.create({
        firstName,
        lastName,
        email,
        gmail,
        password: gmail ? null : hashedPassword,
      });
  
      const token = genToken({ email });
  
      res.status(201).json({ message: "Sign up success", token });
    } catch (err) {
      next(err);
    }
  };
  
  exports.loginCustomer = async (req, res, next) => {
    try {
      const { emailOrGmail, password } = req.body;
  
      const customer = await Customer.findOne({
        where: {
          [Op.or]: [{ email: emailOrGmail }, { gmail: emailOrGmail }],
        },
      });
  
      if (!customer) {
      }
  
      const isMatch = await bcrypt.compare(password, customer.password);
  
      if (!isMatch) {
      }
  
      const token = genToken({ email: emailOrGmail });
      res.json({ message: "Login success", token });
    } catch (err) {
      next(err);
    }
  };
  
