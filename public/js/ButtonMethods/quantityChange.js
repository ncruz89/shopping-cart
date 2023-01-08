import { updateCartTotal } from "../CartMethods/updateCartTotal.js";

// adds event listeners on quantity change buttons and updates cart total
export const quantityChange = function () {
  let quantityInputs = document.querySelectorAll(".cart-quantity-input");
  quantityInputs.forEach((input) =>
    input.addEventListener("change", async function (e) {
      let input = +e.target.value;
      if (isNaN(input) || input <= 0) e.target.value = 1;
      updateCartTotal();
    })
  );
};
