const mongoose = require("mongoose");

// mongoose schema for item
const Item = mongoose.model("Item", {
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
});

// simple database setup for testing. is reset on program start by deleting any items in db and adding a fresh inventory
const setupDatabase = async () => {
  await Item.deleteMany();

  Item.insertMany(
    [
      {
        name: "T-Shirt (black)",
        quantity: 10,
        price: 1999,
      },
      {
        name: "T-Shirt (red)",
        quantity: 0,
        price: 1999,
      },
      {
        name: "T-Shirt (blue)",
        quantity: 5,
        price: 1999,
      },
      {
        name: "Coffee Cup (red)",
        quantity: 2,
        price: 699,
      },
      {
        name: "Coffee Cup (black)",
        quantity: 10,
        price: 699,
      },
      {
        name: "Coffee Cup (blue)",
        quantity: 5,
        price: 699,
      },
    ],
    function (err) {
      if (err) return console.log(err);
    }
  );
};

setupDatabase();

module.exports = Item;
