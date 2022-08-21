const { app } = require("./app");

const port = process.env.PORT;

// Listen on port 3000
app.listen(port, () => {
  console.log("Starting website on port " + port);
});
