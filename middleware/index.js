const cookie = require("cookie");
const jwt = require("jsonwebtoken");

exports.validateToken = (req, res, next) => {
  let cookies = req.headers.cookie;

  if (cookies) {
    cookies = cookie.parse(cookies);

    if (cookies.token) {
      try {
        const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
        // TODO: get user from database and pass to req
        req.user = { username: "username" };
      } catch (error) {
        return res.status(400).json({ error: "invalid token" });
      }
    }
  }

  next();
};
