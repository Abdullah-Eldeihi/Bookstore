const express = require("express");
const { auth, authAndSameIdOrAdmin } = require("../middleware/auth");
const Cart = require("../models/cart");
const Order = require("../models/order");
const User = require("../models/user");

const router = new express.Router();

router.get("/:id", authAndSameIdOrAdmin, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.send(req.user);
  }
  try {
    const userParamId = await User.findById(req.params.id);
    res.send(userParamId);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/me/cart", auth, (req, res) => {});

router.get("/me/orders", auth, (req, res) => {});
router.post("/me/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
