const mongoose = require("mongoose");

// mongoose connection with mongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
});
