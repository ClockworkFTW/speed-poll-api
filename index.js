const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3005;

const app = express();

// Logging
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

// Middlewear
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require("./passport/config")(passport);
exports.passport = passport;

// Database
const { models, sequelize } = require("./models");

app.use((req, res, next) => {
  req.models = models;
  next();
});

// Routes
app.use("/auth", require("./routers/auth.router"));
app.use("/user", require("./routers/user.router"));
app.use("/poll", require("./routers/poll.router"));

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(PORT, () =>
    console.log(`Server running in ${ENV} mode on port ${PORT}`)
  );
});
