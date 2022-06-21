const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Customer } = require("../models");
const createError = require("../services/createError");

const genToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.registerDriver = async (req, res, next) => {
  try {
    const { firstName, lastName, email, gmail, password, confirmPassword } =
      req.body;

    if (!email && gmail) {
      createError("Please enter email or gmail", 400);
    }

    if (!password) {
      createError("Please enter password", 400);
    }

    if (password !== confirmPassword) {
      createError("Password not match", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      firstName,
      lastName,
      email: email ? email : null,
      gmail: gmail ? gmail : null,
      password: gmail ? null : hashedPassword,
    });

    const token = genToken({ id: customer.id });

    res.status(201).json({ message: "Sign up success", token });
  } catch (err) {
    next(err);
  }
};

exports.loginDriver = async (req, res, next) => {
  try {
    const { email, password, gmail } = req.body;

    const customer = await Customer.findOne({
      where: {
        [Op.or]: [{ email }, { gmail }],
      },
    });

    if (!customer) {
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
    }

    const token = genToken({ id: customer.id });
    res.json({ message: "Login success", token });
  } catch (err) {
    next(err);
  }
};
