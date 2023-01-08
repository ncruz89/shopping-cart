import { quantityChange } from "../ButtonMethods/quantityChange.js";
import { addRemoveBtn } from "../ButtonMethods/addRemoveBtn.js";

let removeCartItemBtns = document.querySelectorAll(".btn-danger");
let quantityInputs = document.querySelectorAll(".cart-quantity-input");

/**
 * Adds items to cart. Checks if items exist and adds event listeners to cart item buttons
 * @param {string} title title of cart item to be added
 * @param {string} price price of cart item to be added
 * @param {url} image image url of cart item
 * @param {string} id server id of cart item to be added as dataset to cart item
 */
export const addItemToCart = function (title, price, image, id) {
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
