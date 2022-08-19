const mongoose = require("mongoose");
const validator = require("validator");

const authorSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [15, "First name too long."],
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("First name must contain only letters.");
        }
      },
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [15, "First name too long."],
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("First name must contain only letters.");
        }
      },
    },
    date_of_birth: {
      type: Date,
    },
    date_of_death: {
      type: Date,
    },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  {
    timestamp: true,
  }
);

authorSchema.virtual("author", {
  ref: "Product",
  foreignField: "author",
  localField: "_id",
});

authorSchema.set("toObject", { virtuals: true });
authorSchema.set("toJSON", { Virtuals: true });

// async function firstNameAndLastName(value) {
//   try {
//     const authorToCheck = await Author.find({
//       first_name: this.first_name,
//       last_name: this.last_name,
//     });
//     if (authorToCheck.length > 0) {
//       return false;
//     } else {
//       return true;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

authorSchema.pre("validate", async function (next) {
  const currentAuthor = this;
  try {
    const authorToCheck = await Author.find({
      first_name: currentAuthor.first_name,
      last_name: currentAuthor.last_name,
    });
    if (authorToCheck.length > 0) {
      next(new Error("Author already exists!"));
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
  }
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
