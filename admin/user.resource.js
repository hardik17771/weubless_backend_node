const AdminJS = require("adminjs");
const User = require("../models/User"); // Replace with the actual path to your User model

const UserResource = {
  resource: User.User2,
  options: {
    properties: {
      // Define the properties you want to display/edit
      // Example:
      email: { isVisible: { list: true, show: true, edit: true } },
      name: { isVisible: { list: true, show: true, edit: true } },
    },
  },
};

module.exports = UserResource;
