const express = require("express");
const router = express.Router();

const { test, postLogin, postRegister, postCheckToken } = require("../controllers/server.controllers.js");

router.use(express.json());
router.get("/test/", test);
router.post("/register/", postRegister);
router.post("/login/loginSubmit", postLogin);
router.post("/check-token-expiration", postCheckToken);

module.exports = router;