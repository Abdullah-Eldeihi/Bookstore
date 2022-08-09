// Requires.
const express = require("express");
const { authAdmin } = require("../middleware/auth");
const { creatorName } = require("../helper");
const User = require("../models/user");

// Instantiate the router.
const router = new express.Router();

router.get("/:id", authAdmin, async (req, res) => {
  // check if params id and use id the same so we won't have to query the db, then return the user.
  if (req.params.id === req.user._id) {
    return res.send(req.user);
  }
  // try to fetch the user with that id and print it, if not return 404.
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
