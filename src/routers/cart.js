const express = require("express");
const { auth, authAndSameIdOrAdmin, authAdmin } = require("../middleware/auth");
const { creatorName } = require("../helper");
const Cart = require("../models/cart");

const router = new express.Router();

router.post("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  if (req.user.isAdmin || req.user._id === req.body.userId) {
    const newCart = new Cart(req.body);
  } else {
    return res.status(403).send();
  }

  try {
    await newCart.save();
    res.send(newCart);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.render("cart", {
      creatorName,
      cart,
    });
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/", authAdmin, async (req, res) => {
  let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const limit = 20;
  const docCount = await Cart.countDocuments();
  const totalPages = Math.ceil(docCount / limit);
  if (pageNumber <= 0) {
    pageNumber = 1;
  }
  try {
    const carts = await Cart.find({})
      .limit(limit)
      .skip((pageNumber - 1) * limit);
    res.send({ carts, pageNumber, totalPages });
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/:cartId", authAdmin, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    res.send(cart);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.send(updatedCart);
  } catch (e) {
    res.status(500).send();
  }
});
router.patch("/:cartId", authAdmin, async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: req.params.cartId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.send(updatedCart);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const deletedCart = await Cart.findOneAndDelete({
      userId: req.params.userId,
    });
    res.send(deletedCart);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
