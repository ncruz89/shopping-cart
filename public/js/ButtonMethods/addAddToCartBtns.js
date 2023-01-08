import { addItemToCart } from "../CartMethods/addItemToCart.js";
import { updateCartTotal } from "../CartMethods/updateCartTotal.js";
import { checkInventory } from "../InventoryMethods/checkInventory.js";

const addToCartBtns = document.querySelectorAll(".shop-item-button");

/**
 * adds event listeners to merch items that add item to carts
 * checks if item is in inventory on server
 * if out of stock, replaces add to cart button text with out of stock and disables button
 * if in stock retrieves item ID from server side and passes title, price, image and ID as parameters in addItemToCart()
 * updates cart total
 */
export const addAddToCartBtns = function () {
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
