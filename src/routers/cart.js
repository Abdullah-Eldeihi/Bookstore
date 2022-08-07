const express = require("express");
const { auth } = require("../middleware/auth");
const { creatorName } = require("../helper");

const router = new express.Router();

router.get("/cart", auth, (req, res) => {
  res.render("cart", {
    creatorName,
  });
});

module.exports = router;
