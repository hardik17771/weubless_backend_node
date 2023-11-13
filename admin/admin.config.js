const AdminJS = require("adminjs");
const express = require("express");
const { UserResource } = require("./user.resource"); // Replace with the actual path

const adminJsOptions = {
  resources: [UserResource],
  rootPath: "/admin",
  // Add any other configuration options you need
};

const adminJs = new AdminJS(adminJsOptions);
const router = AdminJS.express.buildRouter(adminJs);

module.exports = router;
