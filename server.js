const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const invalidAddress = require("./middlewares/invalidAddress");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");
const authRoute = require("./routes/authRoute");
const restaurantRoute = require("./routes/restaurantRoute");
const customerRoute = require("./routes/customerRoute");
const driverRoute = require("./routes/driverRoute");
const authenticator = require("./middlewares/authenticator");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/restaurant", authenticator("restaurant"), restaurantRoute);
app.use("/customer", authenticator("customer"), customerRoute);
app.use("/driver", authenticator("driver"), driverRoute);

app.use(errorHandler);
app.use(invalidAddress);

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
  // sequelize.sync({ alter: true });
  // sequelize.sync({ force: true });
});
