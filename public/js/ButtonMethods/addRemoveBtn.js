import { updateCartTotal } from "../CartMethods/updateCartTotal.js";

// adds remove button event listener on cart items and updates cart total
export const addRemoveBtn = function () {
  let removeCartItemBtns = document.querySelectorAll(".btn-danger");

  removeCartItemBtns.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      const btnClicked = e.target;
      btnClicked.parentElement.parentElement.remove();
      updateCartTotal();
    })
  );
};
