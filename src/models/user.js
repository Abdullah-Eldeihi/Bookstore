const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
    maxlength: [15, "Last name too long."],
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error("Last name must only contain letters.");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  phone_number: {
    type: String,
    required: true,
    // minlength: [11, "Phone number too short."],
    // maxlength: [11, "Phone number too long."],
    trim: true,
    validate: [/^[0-9]{11}$/, "Phone number must be 11 digits"],
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  birth_year: {
    type: String,
  },
  birth_month: {
    type: String,
  },
  birth_day: {
    type: String,
  },
  address_line: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Find user by email and compare the hash password with the password given.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};
// Add a method to the instances of User to generate a token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "bookstoretoken");
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Change to json to not show password and tokens
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Hash plan password before saving.
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    if (!validator.isStrongPassword(user.password)) {
      throw new Error("Please use a stronger password.");
    }
    if (user.password.includes("password")) {
      throw new Error("The password can't contain the word password.");
    }

    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
