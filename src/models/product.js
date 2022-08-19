const mongoose = require("mongoose");
const Author = require("./author");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      minlength: [0, "The price has to be 0 or more."],
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      validate: [/^[0-9]{13}$/, "ISBN has to be 13 digits."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
  },
  {
    timestamp: true,
  }
);

productSchema.pre("save", async function (next) {
  const product = this;
  try {
    const author = await Author.findById(product.author);
    author.books.push(product._id);
    await author.save({ validateBeforeSave: false });
  } catch (e) {
    next(e);
  }
  next();
});

productSchema.pre("deleteOne", { document: true }, async function (next) {
  const product = this;
  try {
    const updated = await Author.findOneAndUpdate(
      { _id: product.author },
      {
        $pull: {
          books: { _id: product._id },
        },
      }
    );
  } catch (e) {
    next(e);
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
