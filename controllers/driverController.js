const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');
const {
  Driver,
  Order,
  Restaurant,
  sequelize,
  OrderMenu,
} = require('../models');
const { Op, where, QueryTypes } = require('sequelize');
const getDistanceFromLatLonInKm = require('../services/calcDistance');

exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.user.id);
    const { firstName, lastName } = req.body;

    if (!driver) {
      createError('You are unauthorize.', 400);
    }

    if (!firstName && !lastName && !req.imageFile) {
      createError('You cannot update empty data', 400);
    }

    if (firstName) {
      driver.firstName = firstName;
    }

    if (lastName) {
      driver.lastName = lastName;
    }

    if (req.imageFile && driver.driverImage) {
      const deleteRes = await destroy(driver.driverImagePublicId);
      console.log(deleteRes);
    }

    if (req.imageFile) {
      driver.driverImagePublicId = req.imageFile.public_id;
      driver.driverImage = req.imageFile.secure_url;
    }

    await driver.save();

    res.json({ message: 'Update profile success.' });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.user.id);
    const { status } = req.body;

    if (!driver) {
      createError('You are unauthorize.', 400);
    }

    if (status !== 'UNAVAILABLE' && status !== 'AVAILABLE') {
      createError("Status must be 'AVAILABLE' or 'UNAVAILABLE'", 400);
    }

    if (driver.status === status) {
      createError('You cannot update same status as your current status', 400);
    }

    if (status) {
      driver.status = status;
    }

    await driver.save();

    res.json({ message: 'Update status success' });
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { id } = req.user;
    //current latitude and longitude
    const { latitude, longitude } = req.body;
    if (latitude == null || latitude == null) {
      createError('latitude and longitude are required', 400);
    }

    await Driver.update({ latitude, longitude }, { where: { id } });

    res.json({ message: 'successfully recorded position' });
  } catch (err) {
    next(err);
  }
};

exports.acceptOrder = async (req, res, next) => {};

exports.searchOrder = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    let order = await Order.findAll({
      include: [
        {
          model: Restaurant,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: OrderMenu,
        },
      ],
    });
    parseorder = JSON.parse(JSON.stringify(order));
    let orderArr = [];
    parseorder.forEach((element) => {
      getDistanceFromLatLonInKm(
        latitude,
        longitude,
        element.Restaurant.latitude,
        element.Restaurant.longitude,
      ) <= 10
        ? orderArr.push(element)
        : '';
    });

    res.json({ order: orderArr });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (order.status === 'IN_CART')
      createError('You cannot view this resource', 400);

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
