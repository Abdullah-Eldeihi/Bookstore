// Core import.
const path = require("path");

// npm imports.
const express = require("express");
const hbs = require("hbs");
const { allowedNodeEnvironmentFlags } = require("process");

//local imports
require("./db/mongoose");
const loginRouter = require("./routers/login");
const signupRouter = require("./routers/signup");
const logoutRouter = require("./routers/logout");
const shopRouter = require("./routers/shop");
const cartRouter = require("./routers/cart");
const adminRouter = require("./routers/admin");
const userRouter = require("./routers/user");

const { creatorName } = require("./helper");

// Start the app.
const app = express();

// Port
const port = process.env.PORT || 3000;

//app uses (routers / json)
app.use(express.json());
app.use(loginRouter);
app.use(signupRouter);
app.use(logoutRouter);
app.use(shopRouter);
app.use(cartRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);

// Paths to directories.
const publicDir = path.join(__dirname, "../public");
const partialsDir = path.join(__dirname, "../templates/partials");
const viewsDir = path.join(__dirname, "../templates/views");

// Set the view engine and the directory of the partials and views.
app.set("view engine", "hbs");
app.set("views", viewsDir);
hbs.registerPartials(partialsDir);
app.set("view options", { layout: "layout" });

// Use static directory
app.use(express.static(publicDir));

// routing
app.get("", (req, res) => {
  res.render("index", {
    creatorName,
  });
});
app.get("/support", (req, res) => {
  res.render("support", {
    creatorName,
  });
});
app.get("*", (req, res) => {
  res.render("404page", {
    name: creatorName,
  });
});

// Listen on port 3000
app.listen(3000, () => {
  console.log("Starting website on port 3000.");
});

console.log("Git test.");
