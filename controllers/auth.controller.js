exports.local = (req, res) => {
  res.cookie("user", req.user);
  res.end();
};

exports.google = (req, res) => {
  res.cookie("user", req.user);
  res.redirect("http://localhost:3000");
};

exports.facebook = (req, res) => {
  res.cookie("user", req.user);
  res.redirect("http://localhost:3000");
};

exports.apple = (req, res) => {
  console.log(req.user);
  res.cookie("user", req.user);
  res.redirect("http://localhost:3000");
};
