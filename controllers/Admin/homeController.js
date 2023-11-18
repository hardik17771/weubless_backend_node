const indexView = (req, res, next) => {
  res.render("admin/home");
};

module.exports = {
  indexView,
};
