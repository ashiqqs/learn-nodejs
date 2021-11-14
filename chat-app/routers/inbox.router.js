//external imports
const express = require("express");

//internal imports
const { getInbox } = require("../controllers/inbox.controller");

const inboxRoute = express.Router();

//login page
inboxRoute.get("/", getInbox);

module.exports = inboxRoute;
