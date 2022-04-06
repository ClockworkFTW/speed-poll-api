const { passport } = require("../index");

exports.localLogin = (req, res) => {
  passport.authenticate("local", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({ error });
    }

    res.cookie("token", user, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.redirect(process.env.APP_URL);
  })(req, res);
};

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({ error });
    }

    res.cookie("token", user, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.redirect(process.env.APP_URL);
  })(req, res);
};

exports.facebookLogin = passport.authenticate("facebook", {
  scope: ["public_profile", "email"],
});

exports.facebookCallback = (req, res) => {
  passport.authenticate("facebook", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({ error });
    }

    res.cookie("token", user, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.redirect(process.env.APP_URL);
  })(req, res);
};

exports.appleLogin = passport.authenticate("apple");

exports.appleCallback = (req, res) => {
  passport.authenticate("apple", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({ error });
    }

    res.cookie("token", user, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

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
