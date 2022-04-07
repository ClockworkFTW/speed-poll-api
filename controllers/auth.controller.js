const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v5: uuidv5 } = require("uuid");

const { models } = require("../models");
const { passport } = require("../index");

exports.localSignUp = async (req, res) => {
  try {
    const { username, email, passwordOne, passwordTwo } = req.body;

    // Validate password
    if (passwordOne !== passwordTwo) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Generate uuid and password hash
    const uuid = uuidv5(email, process.env.UUID_NAMESPACE);
    const password = await bcrypt.hash(passwordOne, 10);

    // Create user and format object
    let user = await models.User.create({
      uuid,
      username,
      email,
      password,
      source: "local",
    });
    user = user.get({ plain: true });
    user = { uuid: user.uuid, username: user.username };

    // Generate jwt and attach to cookie
    const token = jwt.sign(user.uuid, process.env.JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    // Respond with user and jwt cookie
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.localSignIn = (req, res) => {
  passport.authenticate("local", { session: false }, (error, user) => {
    // Respond with error message
    if (error || !user) {
      return res.status(400).json(error);
    }

    // Generate jwt and attach to cookie
    const token = jwt.sign(user.uuid, process.env.JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    // Respond with user and jwt cookie
    res.json({ user });
  })(req, res);
};

exports.googleSignIn = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    // Redirect with error message
    if (error) {
      return res.redirect(
        `${process.env.APP_URL}/sign-in?error=${error.message}`
      );
    }

    // Generate jwt and attach to cookie
    const token = jwt.sign(user.uuid, process.env.JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    // Redirect with jwt cookie
    res.redirect(process.env.APP_URL);
  })(req, res);
};

exports.facebookSignIn = passport.authenticate("facebook", {
  scope: ["public_profile", "email"],
});

exports.facebookCallback = (req, res) => {
  passport.authenticate("facebook", { session: false }, (error, user) => {
    // Redirect with error message
    if (error) {
      return res.redirect(
        `${process.env.APP_URL}/sign-in?error=${error.message}`
      );
    }

    // Generate jwt and attach to cookie
    const token = jwt.sign(user.uuid, process.env.JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    // Redirect with jwt cookie
    res.redirect(process.env.APP_URL);
  })(req, res);
};

exports.appleSignIn = passport.authenticate("apple");

exports.appleCallback = (req, res) => {
  passport.authenticate("apple", { session: false }, (error, user) => {
    // Redirect with error message
    if (error) {
      return res.redirect(
        `${process.env.APP_URL}/sign-in?error=${error.message}`
      );
    }

    // Generate jwt and attach to cookie
    const token = jwt.sign(user.uuid, process.env.JWT_SECRET);

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    // Redirect with jwt cookie
    res.redirect(process.env.APP_URL);
  })(req, res);
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });

  res.end();
};
