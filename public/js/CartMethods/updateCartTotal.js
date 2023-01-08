const cartItemsContainer = document.querySelector(".cart-items");

// updates cart total
// retrieves price and quantity in cart to calculate and set total
export const updateCartTotal = function () {
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
