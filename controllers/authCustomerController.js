const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Customer } = require("../models");

const genToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res, next) => {
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
      email: gmail ? null : email,
      gmail: email ? null : gmail,
      password: gmail ? null : hashedPassword,
    });

    const token = genToken({ id: customer.id });

    res.status(201).json({ message: "Sign up success", token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
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
