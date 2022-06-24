const { sequelize } = require('./models');

sequelize.sync({ alter: true });
