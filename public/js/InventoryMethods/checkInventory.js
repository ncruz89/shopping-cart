// Checks if item added to cart is in the server inventory
// returns either out of stock message or item id in server
export const checkInventory = async function (itemName) {
  try {
    const res = await fetch(`store?name=${itemName}`);
    const data = await res.text();
    return data;
  } catch (err) {
    console.log(err);
  }
};
