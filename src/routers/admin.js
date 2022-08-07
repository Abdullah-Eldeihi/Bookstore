const express = require("express");
const { authAdmin, auth } = require("../middleware/auth");
const { creatorName } = require("../helper");

const router = new express.Router();

router.get("/", authAdmin, (req, res) => {
  res.send(req.user);
});

module.exports = router;
