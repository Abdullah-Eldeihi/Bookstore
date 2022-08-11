// Requires.
const express = require("express");
const { authAdmin } = require("../middleware/auth");
const { creatorName } = require("../helper");
const Product = require("../models/product");

// Declare router to export.
const router = new express.Router();

// Create a new product.
router.post("/", authAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await Product.save();
    res.send(savedProduct);
  } catch (e) {
    res.status(500).send();
  }
});

// Get /shop and render the view and send the information for it.
router.get("/", (req, res) => {
  res.render("shop", {
    creatorName,
  });
});

// Get a specific product in the shop.
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (e) {
    res.status(404).render("404page", {
      creatorName,
    });
  }
});

// Update a specific product in the shop.
router.patch("/:id", authAdmin, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "desc", "img", "categories", "price"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid updates!" });
  }

  try {
    const product = await Product.findById(req.params.id);
    updates.forEach((update) => (product[update] = req.body[update]));

    await product.save();

    res.send(product);
  } catch (e) {
    res.status(400).send();
  }
});

// Delete a specific product in the shop.
router.delete("/:id", authAdmin, async (req, res) => {
  // Wrote two try catch statements to handle two different errors, one when the item doesn't exist
  // and one when the db refuses to remove due to internal error.
  // There has to be a way to do it in a single try catch statement can do an if condition based on that in the
  // catch clause.
  try {
    const product = await Product.findById(req.params.id);
  } catch (e) {
    res.status(404).render("404page", {
      creatorName,
    });
  }
  try {
    await product.remove();
    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
