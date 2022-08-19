const express = require("express");
const { auth, authAndSameIdOrAdmin, authAdmin } = require("../middleware/auth");
const { creatorName } = require("../helper");
const Order = require("../models/order");

const router = new express.Router();

router.post("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  if (req.user.isAdmin || req.user._id === req.body.userId) {
    const newOrder = new Order(req.body);
  } else {
    return res.status(403).send();
  }

  try {
    await newOrder.save();

    res.send(newOrder);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/:orderId", authAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.send(order);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId });
    res.send(order);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/", authAdmin, async (req, res) => {
  let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const limit = 20;
  const docCount = await Order.countDocuments();
  const totalPages = Math.ceil(docCount / limit);
  if (pageNumber <= 0) {
    pageNumber = 1;
  }
  try {
    const orders = await Order.find({})
      .limit(limit)
      .skip((pageNumber - 1) * limit);
    res.send({ orders, pageNumber, totalPages });
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.send(updatedOrder);
  } catch (e) {
    res.status(500).send();
  }
});
router.patch("/:orderId", authAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.send(updatedOrder);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/:userId", authAndSameIdOrAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({
      userId: req.params.userId,
    });
    res.send(deletedOrder);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
