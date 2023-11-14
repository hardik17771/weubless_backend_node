// adminBridge.js
// import AdminJS from "adminjs";
// import { buildAuthenticatedRouter } from "@adminjs/express";
// import mongoose from "mongoose";

const AdminJS = require("adminjs");
const { buildAuthenticatedRouter } = require("@adminjs/express");
const mongoose = require("mongoose");

const adminJs = new AdminJS({
  databases: [mongoose],
  rootPath: "/admin",
  resources: [
    // Add your resources here
    // Example: { resource: User, options: { parent: { name: 'Admin' } } },
  ],
});

const adminRouter = buildAuthenticatedRouter(adminJs);

module.exports = { adminJs, adminRouter };
