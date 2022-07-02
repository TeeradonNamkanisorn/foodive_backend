const {
  Restaurant,
  Customer,
  Driver,
  Tag,
  Category,
  sequelize,
} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('../services/createError');

const { Op } = require('sequelize');

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//Only for register with email/password
exports.registerRestaurant = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password, phoneNumber, confirmPassword } = req.body;

    if (password !== confirmPassword) createError('invalid credentials', 400);

    const hashedPw = await bcrypt.hash(password, 10);

    const token = genToken({ email, role: 'restaurant' });

    const restaurant = await Restaurant.create(
      {
        name,
        latitude,
        longitude,
        email,
        password: hashedPw,
        phoneNumber,
      },
      { transaction: t },
    );

    console.log(restaurant.id);
    await Category.create(
      { name: 'other', restaurantId: restaurant.id },
      { transaction: t },
    );
    await t.commit();
    res.status(201).json({ message: 'sign up success', token });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.loginRestaurant = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({
      where: {
        email,
      },
    });
    console.log(password, restaurant.password);

    const isCorrect = await bcrypt.compare(password, restaurant.password);

    if (!isCorrect) createError('Invalid email or password', 400);

    const token = genToken({ email, role: 'restaurant' });

    res.json({ message: 'Login success', token });
  } catch (err) {
    next(err);
  }
};

exports.registerCustomer = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      gmail,
      password,
      phoneNumber,
      confirmPassword,
    } = req.body;

    if (!email && !gmail) {
      createError('Email is required', 400);
    }

    if (!password) {
      createError('Password is required', 400);
    }

    if (password !== confirmPassword) {
      createError('Password and confirm password are not match', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      gmail,
      password: gmail ? null : hashedPassword,
    });

    const token = genToken({ email, role: 'customer' });

    res.status(201).json({ message: 'Sign up success', token });
  } catch (err) {
    next(err);
  }
};

exports.loginCustomer = async (req, res, next) => {
  try {
    const { email, gmail, password } = req.body;

    const customer = await Customer.findOne({
      where: {
        [Op.or]: [{ email: email || '' }, { gmail: gmail || '' }],
      },
    });

    if (!customer) {
      createError('You are unauthorize', 400);
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      createError('You are unauthorize', 400);
    }

    const token = genToken({ email, role: 'customer' });
    res.json({ message: 'Login success', token });
  } catch (err) {
    next(err);
  }
};

exports.registerDriver = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      gmail,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    if (!firstName) {
      createError('Please enter your first name.', 400);
    }

    if (!lastName) {
      createError('Please enter your last name.', 400);
    }

    if (!email && gmail) {
      createError('Please enter email or gmail', 400);
    }

    if (!phoneNumber) {
      createError('Please enter phone number', 400);
    }

    if (!password) {
      createError('Please enter password', 400);
    }

    if (password !== confirmPassword) {
      createError('Password not match', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      firstName,
      lastName,
      email: email ? email : null,
      gmail: gmail ? gmail : null,
      phoneNumber,
      password: gmail ? null : hashedPassword,
      status: 'UNAVAILABLE',
    });

    const token = genToken({ email, role: 'driver' });

    res.status(201).json({ message: 'Sign up success', token });
  } catch (err) {
    next(err);
  }
};

exports.loginDriver = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({
      where: {
        email,
      },
    });

    if (!driver) {
      createError('You are unauthorize', 400);
    }

    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      createError('You are unauthorize', 400);
    }

    const token = genToken({ email, role: 'driver' });
    res.json({ message: 'Login success', token });
  } catch (err) {
    next(err);
  }
};

//
