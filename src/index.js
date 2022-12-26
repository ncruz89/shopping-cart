const app = require("./app");

const port = process.env.PORT;

// app initialization
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
