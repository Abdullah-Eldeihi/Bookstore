// Requires.
const express = require("express");
const { authAdmin } = require("../middleware/auth");
const { creatorName } = require("../helper");
const Author = require("../models/author");

// Instantiate the router.
const router = new express.Router();

router.post("/", authAdmin, async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.send(newAuthor);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.find({ _id: req.params.id });
    res.send(author);
  } catch (e) {
    re.status(404).send(e);
  }
});
module.exports = router;
