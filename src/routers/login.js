const express = require("express");
const User = require("../models/user");
const { creatorName } = require("../helper");

const router = new express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});
router.get("/", (req, res) => {
  res.render("login", {
    creatorName,
  });
});
module.exports = router;
