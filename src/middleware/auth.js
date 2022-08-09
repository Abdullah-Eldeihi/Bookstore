const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "bookstoretoken");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
const authAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user.isAdmin) {
      res.status(403).send();
      return;
    }
    next();
  });
};
const authAndSameIdOrAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user._id.equals(req.params.id) && !req.user.isAdmin) {
      return res.status(403).send();
    }
    next();
  });
};
module.exports = { auth, authAdmin, authAndSameIdOrAdmin };
