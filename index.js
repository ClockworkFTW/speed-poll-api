const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3005;
const ENV = process.env.NODE_ENV;

// Logging
if (ENV === "developement") {
  app.use(morgan("dev"));
}

// Middlewear
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.APP_URL, credentials: true }));
app.use(session({ resave: true, saveUninitialized: true, secret: "test" }));
require("./passport/config")(passport);
exports.passport = passport;

// Database
const { sequelize, models, seed } = require("./models");
const eraseDatabaseOnSync = true;

app.use((req, res, next) => {
  req.models = models;
  next();
});

// Routes
app.use("/auth", require("./routers/auth.router"));
app.use("/user", require("./routers/user.router"));
app.use("/poll", require("./routers/poll.router"));
app.use("/vote", require("./routers/vote.router"));

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await seed();
  }

  app.listen(PORT, () =>
    console.log(`Server running in ${ENV} mode on port ${PORT}`)
  );
});
