function authenticate(req, res, next) {
  // Check if the user is authenticated
  if (!req.user) {
    return res.redirect("/login"); // Redirect to the login page if not authenticated
  }

  // User is authenticated, proceed to the next middleware/route handler
  next();
}

module.exports = authenticate;
