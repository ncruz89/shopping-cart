const express = require("express");
const Item = require("../models/item");
const router = new express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Checks inventory of item added to cart before adding item to cart client side.
 * returns either error or server-side id to be added as an dataset to the cart item for purchasing security
 */
router.get("/store", async (req, res) => {
  const _name = req.query.name;
  try {
    let item = await Item.findOne({ name: _name });

    if (!item || item.quantity === 0)
      return res.send("Sorry. Item out of stock");
    res.send(item._id);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * router on purchase button click.
 * receives an object of cart items along with Token ID for stripe
 * checks inventory and if in inventory calculates if item amount in inventory is greater than purchase amount
 * if so runs stripe charge and updates inventory amount.
 * if not returns detailed alert to update quantity amount in cart. Payment not accepted. Inventory not updated
 */
router.patch("/store", async (req, res) => {
  const _items = req.body.items;

  let total = 0;
  let errorMessage = "";
  try {
    for (const itemName in _items) {
      const item = await Item.findOne({ name: itemName });
      console.log(item);

      if (!item) errorMessage += "Sorry. Item not found";

      if (item.quantity - _items[itemName] < 0) {
        errorMessage += `Sorry. Only ${item.quantity} - ${item.name} remain in stock.\n`;
      }

      if (item.quantity - _items[itemName] >= 0) {
        let quantityRemaining = item.quantity - _items[itemName];
        total += item.price * _items[itemName];

        _items[itemName] = quantityRemaining;
      }
    }

    if (errorMessage)
      return res.send((errorMessage += "Please update quantity."));
  } catch (e) {
    res.status(500).send(e);
  }
  try {
    const stripeRes = await stripe.charges.create({
      amount: total,
      source: req.body.stripeTokenID,
      currency: "usd",
    });

    if (stripeRes.status === "succeeded") {
      if (!errorMessage) {
        for (const itemName in _items) {
          await Item.findOneAndUpdate(
            { name: itemName },
            { quantity: _items[itemName] }
          );
        }
        res.send("Payment Accepted. Thank you for your purchase.");
      }
    }
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});

module.exports = router;
