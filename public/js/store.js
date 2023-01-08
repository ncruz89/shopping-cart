import { addAddToCartBtns } from "./ButtonMethods/addAddToCartBtns.js";
import { addRemoveBtn } from "./ButtonMethods/addRemoveBtn.js";
import { quantityChange } from "./ButtonMethods/quantityChange.js";
import { addPurchaseBtn } from "./ButtonMethods/addPurchaseBtn.js";

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
