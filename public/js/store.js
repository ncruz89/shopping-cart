let removeCartItemBtns = document.querySelectorAll(".btn-danger");
let quantityInputs = document.querySelectorAll(".cart-quantity-input");
const cartItemsContainer = document.querySelector(".cart-items");
const addToCartBtns = document.querySelectorAll(".shop-item-button");
const purchaseBtn = document.querySelector(".btn-purchase");

const stripeHandler = StripeCheckout.configure({
  key: "pk_test_51LVxL9Ku1iytqIwFZ8mPNF3ueGvVFLWIc2sg0l1WTxzirBYA47lCurJLWvJ5qWZq3yl1fvK721C66xTMWzHyd0S500xmHLWdNd",
  locale: "en",
  token: async function (token) {
    const titlesArray = [
      ...cartItemsContainer.querySelectorAll(".cart-item-title"),
    ].map((el) => el.innerText);

    const quantitiesArray = [
      ...cartItemsContainer.querySelectorAll(".cart-quantity-input"),
    ].map((el) => +el.value);

    const items = {};
    titlesArray.forEach((key, i) => (items[key] = quantitiesArray[i]));

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

const addPurchaseBtn = function () {
  purchaseBtn.addEventListener("click", function (e) {
    var priceElement = document.getElementsByClassName("cart-total-price")[0];
    const price = parseFloat(priceElement.innerText.replace("$", "")) * 100;
    if (!price) return alert("Cart is empty.");

    stripeHandler.open({
      amount: price,
    });
  });
};

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
const addRemoveBtn = function () {
  removeCartItemBtns.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      const btnClicked = e.target;
      btnClicked.parentElement.parentElement.remove();
      updateCartTotal();
    })
  );
};
const quantityChange = function () {
  quantityInputs.forEach((input) =>
    input.addEventListener("change", async function (e) {
      let input = +e.target.value;
      if (isNaN(input) || input <= 0) e.target.value = 1;
      updateCartTotal();
    })
  );
};

const checkInventory = async function (itemName) {
  try {
    const res = await fetch(`store?name=${itemName}`);
    const data = await res.text();
    return data;
  } catch (err) {
    console.log(err);
  }
};

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
};

init();
