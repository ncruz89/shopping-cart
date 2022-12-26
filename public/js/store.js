// element caching
let removeCartItemBtns = document.querySelectorAll(".btn-danger");
let quantityInputs = document.querySelectorAll(".cart-quantity-input");
const cartItemsContainer = document.querySelector(".cart-items");
const addToCartBtns = document.querySelectorAll(".shop-item-button");
const purchaseBtn = document.querySelector(".btn-purchase");

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
const addPurchaseBtn = function () {
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

/**
 * adds event listeners to merch items that add item to carts
 * checks if item is in inventory on server
 * if out of stock, replaces add to cart button text with out of stock and disables button
 * if in stock retrieves item ID from server side and passes title, price, image and ID as parameters in addItemToCart()
 * updates cart total
 */
const addAddToCartBtns = function () {
  addToCartBtns.forEach((btn) =>
    btn.addEventListener("click", async function (e) {
      const button = e.target;
      const shopItem = button.parentElement.parentElement;
      const title = shopItem.querySelector(".shop-item-title").innerText;
      const price = shopItem.querySelector(".shop-item-price").innerText;
      const image = shopItem.querySelector(".shop-item-image").src;
      const res = await checkInventory(title);
      if (res === "Sorry. Item out of stock") {
        button.innerText = "Out of Stock";
        button.disabled = true;
        button.classList.replace("btn-primary", "btn-out");

        return alert(res);
      }

      addItemToCart(title, price, image, res);
      updateCartTotal();
    })
  );
};

// adds remove button event listener on cart items and updates cart total
const addRemoveBtn = function () {
  removeCartItemBtns.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      const btnClicked = e.target;
      btnClicked.parentElement.parentElement.remove();
      updateCartTotal();
    })
  );
};

// adds event listeners on quantity change buttons and updates cart total
const quantityChange = function () {
  quantityInputs.forEach((input) =>
    input.addEventListener("change", async function (e) {
      let input = +e.target.value;
      if (isNaN(input) || input <= 0) e.target.value = 1;
      updateCartTotal();
    })
  );
};

// Checks if item added to cart is in the server inventory
// returns either out of stock message or item id in server
const checkInventory = async function (itemName) {
  try {
    const res = await fetch(`store?name=${itemName}`);
    const data = await res.text();
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Adds items to cart. Checks if items exist and adds event listeners to cart item buttons
 * @param {string} title title of cart item to be added
 * @param {string} price price of cart item to be added
 * @param {url} image image url of cart item
 * @param {string} id server id of cart item to be added as dataset to cart item
 */
const addItemToCart = function (title, price, image, id) {
  const cartItems = document.querySelector(".cart-items");

  const cartItemNames = cartItems.querySelectorAll(".cart-item-title");
  let markup = "";

  cartItemNames.forEach((cartItem) => {
    if (cartItem.innerText === title) {
      alert("This item is already added to the cart");
      return (markup = null);
    }
  });
  if (markup !== null) {
    markup = `
  <div class='cart-row' data-itemId='${id}'>
    <div class="cart-item cart-column">
      <img class="cart-item-image" src="${image}" width="100" height="100">
      <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" type="number" value="1">
      <button class="btn btn-danger" type="button">REMOVE</button>
    </div>
  </div>`;
    cartItems.insertAdjacentHTML("beforeend", markup);
  }
  quantityInputs = document.querySelectorAll(".cart-quantity-input");

  quantityChange();
  removeCartItemBtns = document.querySelectorAll(".btn-danger");
  addRemoveBtn();
};

// updates cart total
// retrieves price and quantity in cart to calculate and set total
const updateCartTotal = function () {
  let total = 0;
  const cartRows = cartItemsContainer.querySelectorAll(".cart-row");
  cartRows.forEach((cartRow) => {
    const priceElement = cartRow.querySelector(".cart-price");
    const quantityElement = cartRow.querySelector(".cart-quantity-input");
    const price = parseFloat(priceElement.innerText.replace("$", ""));
    const quantity = parseFloat(quantityElement.value);
    total = total + price * quantity;
  });
  total = Math.round(total * 100) / 100;
  document.querySelector(".cart-total-price").innerText = "$" + total;
};

const init = function () {
  addAddToCartBtns();
  addRemoveBtn();
  quantityChange();
  addPurchaseBtn();
  console.log(
    "Can test stripe with card numbers: 4242 4242 4242 4242 for payment accepted."
  );
  console.log("4000 0000 0000 0002 for payment declined");
};

init();
