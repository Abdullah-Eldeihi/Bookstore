const express = require("express");
const { auth, authAndSameIdOrAdmin } = require("../middleware/auth");
const Cart = require("../models/cart");
const Order = require("../models/order");
const User = require("../models/user");

const router = new express.Router();

router.get("/:id", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const userParamId = await User.findById(req.params.id);
    res.send(userParamId);
  } catch (e) {
    res.status(404).send();
  }
});

router.patch("/:id", authAndSameIdOrAdmin, async (req, res) => {
  if (req.body.isAdmin) {
    if (req.body.adminCode !== process.env.ADMIN_CODE) {
      return res.status(403).send();
    } else {
      delete req.body.adminCode;
    }
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "first_name",
    "last_name",
    "email",
    "password",
    "phone_number",
    "country",
    "city",
    "birth_year",
    "birth_month",
    "birth_day",
    "address_line",
    "gender",
    "isAdmin",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
