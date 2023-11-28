const indexView = (req, res, next) => {
  res.render("admin/home");
};

const tablesView = (req, res, next) => {
  res.render("admin/tables");
};

const billingView = (req, res, next) => {
  res.render("admin/billing");
};

const profileView = (req, res, next) => {
  res.render("admin/profile");
};

module.exports = {
  indexView,
  tablesView,
  billingView,
  profileView,
};
