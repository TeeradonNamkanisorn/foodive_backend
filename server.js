const express = require("express");
require("dotenv").config();
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const app = express();

app.use("/");

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
  sequelize.sync({ alter: true });
});
