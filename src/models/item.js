const mongoose = require("mongoose");

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

// const item = new Item({
//   name: "T-shirt (black)",
//   quantity: 10,
// });

// item
//   .save()
//   .then(() => {
//     console.log(item);
//   })
//   .catch((error) => {
//     console.log("ERROR", error);
//   });

// const items = new Item.insertMany([
//   {
//     item: "T-Shirt (black)",
//     quantity: 10,
//   },
//   {
//     item: "T-Shirt (red)",
//     quantity: 5,
//   },
//   {
//     item: "T-Shirt (blue)",
//     quantity: 5,
//   },
//   {
//     item: "Coffee Cup (red)",
//     quantity: 2,
//   },
//   {
//     item: "Coffee Cup (black)",
//     quantity: 10,
//   },
//   {
//     item: "Coffee Cup (blue)",
//     quantity: 5,
//   },
// ]);

// items
//   .save()
//   .then(() => {
//     console.log(items);
//   })
//   .catch((error) => {
//     console.log("ERROR", error);
//   });

module.exports = Item;
