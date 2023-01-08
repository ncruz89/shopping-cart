import { updateCartTotal } from "../CartMethods/updateCartTotal.js";

const purchaseBtn = document.querySelector(".btn-purchase");
const cartItemsContainer = document.querySelector(".cart-items");

const stripeHandler = StripeCheckout.configure({
  key: "pk_test_51LVxL9Ku1iytqIwFZ8mPNF3ueGvVFLWIc2sg0l1WTxzirBYA47lCurJLWvJ5qWZq3yl1fvK721C66xTMWzHyd0S500xmHLWdNd",
  locale: "en",
});

/**
 * Adds event listener to purchase button
 * Grabs price from client side and compares to server side to make sure price wasn't changed via dev tools
 * grabs cart items and quantities. creates objects of itemName: quantity pairs
 * runs stripe and purchase fetch request.
 * if no inventory errors and payment accepted alerts customer and clears cart.
 */
export const addPurchaseBtn = function () {
  purchaseBtn.addEventListener("click", function (e) {
    var priceElement = document.getElementsByClassName("cart-total-price")[0];
    const price = parseFloat(priceElement.innerText.replace("$", "")) * 100;
    if (!price) return alert("Cart is empty.");

    const titlesArray = [
      ...cartItemsContainer.querySelectorAll(".cart-item-title"),
    ].map((el) => el.innerText);

    const quantitiesArray = [
      ...cartItemsContainer.querySelectorAll(".cart-quantity-input"),
    ].map((el) => +el.value);

    const items = {};
    titlesArray.forEach((key, i) => (items[key] = quantitiesArray[i]));

    stripeHandler.open({
      amount: price,
      token: async function (token) {
        const res = await fetch("/store", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            stripeTokenID: token.id,
            items: items,
          }),
        });
        console.log(res);
        const data = await res.text();
        alert(`${data}`);
        if (data === "Payment Accepted. Thank you for your purchase.") {
          cartItemsContainer
            .querySelectorAll(".cart-row")
            .forEach((el) => el.remove());
          updateCartTotal();
        }
      },
    });
  });
};
