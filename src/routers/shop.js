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
    const savedProduct = await newProduct.save();
    res.send(savedProduct);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// Get /shop and render the view and send the information for it.
router.get("/", async (req, res) => {
  try {
    let products;
    let lowerBound;
    let upperBound;
    let pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const limit = 20;
    const docCount = await Product.countDocuments();
    const totalPages = Math.ceil(docCount / limit);
    if (pageNumber <= 0) {
      pageNumber = 1;
    }
    if (Object.keys(req.query).length === 0) {
      products = await Product.find({})
        .populate({
          path: "author",
        })
        .limit(limit)
        .skip((pageNumber - 1) * limit);
    } else {
      if (req.query.priceRange) {
        if (/^\d+[-]\d+$/i.test(req.query.priceRange)) {
          req.query.priceRange = req.query.priceRange.split("-");
          lowerBound = parseInt(req.query.priceRange[0]);
          upperBound = parseInt(req.query.priceRange[1]);
        } else {
          return res.status(400).send();
        }
      }

      products = await Product.find({
        $or: [
          { title: { $regex: ".*" + req.query.title + ".*" } },
          {
            genre: {
              $in: [req.query.genre],
            },
          },
          { isbn: { $regex: ".*" + req.query.isbn + ".*" } },
          { price: { $gte: lowerBound, $lte: upperBound } },
        ],
      })
        .populate({ path: "author" })
        .limit(limit)
        .skip((pageNumber - 1) * 20);
      if (!products.length) {
        return res.status(404).render("404page");
      }
    }
    res.send({ products, pageNumber, totalPages });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// Get a specific product in the shop.
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.populate({
      path: "author",
    });
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
  const allowedUpdates = ["title", "desc", "img", "genre", "price", "isbn"];
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
  try {
    const product = await Product.findOne({
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).render("404page", {
        creatorName,
      });
    }
    await product.deleteOne();

    res.send(product);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
