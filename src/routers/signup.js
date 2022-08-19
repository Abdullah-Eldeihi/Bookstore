// Requires.
const express = require("express");
const User = require("../models/user");
const { creatorName } = require("../helper");

// Instantiate the router.
const router = new express.Router();

router.post("/", async (req, res) => {
  // Declared the user variable at the beginning so the scope is all of the route.
  let user;
  // check if the body has isAdmin as true then checks if the body has adminCode field that equals the secret code.
  // The secret code should be replaced with a verification code that lasts for a certain duration just like how
  // you reset your password. The email that the code is sent to should be someone of a high status in the company.
  if (req.body.isAdmin === true) {
    if (req.body.adminCode === process.env.ADMIN_CODE) {
      delete req.body.adminCode;
      user = new User(req.body);
    } else {
      // If the secret code is not correct send a no permission http code.
      return res.status(403).send();
    }
  } else if (req.body.adminCode) {
    // If the user is not an admin and the body has an adminCode field delete it so it won't produce an error
    // when creating the user with the body.
    delete req.body.adminCode;
    user = new User(req.body);
  }
  try {
    // generate the token, save it and save the user to the database.
    const token = await user.generateAuthToken();
    await user.save();

    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});
router.get("/", (req, res) => {
  res.render("signup", {
    creatorName,
  });
});
module.exports = router;
