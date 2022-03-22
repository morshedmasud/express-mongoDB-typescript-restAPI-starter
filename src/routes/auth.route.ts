const express = require("express");
const router = express.Router();

// Controller
const { userRegister } = require("../controllers/auth.controller");

router.post("/api/auth/register", userRegister);

module.exports = router;
