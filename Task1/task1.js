const productPrices = {
  "Product A": 20,
  "Product B": 40,
  "Product C": 50,
};

const discountRules = {
  flat_10_discount: (cartTotal) => (cartTotal > 200 ? 10 : 0),
  bulk_5_discount: (quantity) => (quantity > 10 ? 0.05 : 0),
  bulk_10_discount: (totalQuantity) => (totalQuantity > 20 ? 0.1 : 0),
  tiered_50_discount: (totalQuantity, quantity) =>
    totalQuantity > 30 && quantity > 15 ? 0.5 : 0,
};

const giftWrapFee = 1;
const shippingFeePerPackage = 5;
const unitsPerPackage = 10;

function calculateDiscount(cart, totalQuantity) {
  const applicableDiscounts = Object.keys(discountRules)
    .map((rule) => discountRules[rule](totalQuantity, cart[rule]))
    .filter((discount) => discount > 0);

  return applicableDiscounts.length > 0
    ? Math.max(...applicableDiscounts)
    : 0;
}

function calculateCartTotal(cart) {
  return Object.keys(cart).reduce(
    (total, product) => total + cart[product].totalAmount,
    0
  );
}

function calculateShippingFee(totalQuantity) {
  return Math.ceil(totalQuantity / unitsPerPackage) * shippingFeePerPackage;
}

function applyDiscountToProduct(product, quantity, discount) {
  const discountedPrice = productPrices[product] * (1 - discount);
  return {
    quantity,
    totalAmount: discountedPrice * quantity,
    discounted: discount > 0,
  };
}

function shoppingCart() {
  const cart = {};
  let totalQuantity = 0;

  for (const product in productPrices) {
    const quantity = parseInt(prompt(`Enter quantity for ${product}:`), 10);
    const isGift = prompt(`Is ${product} wrapped as a gift? (yes/no)`) === "yes";

    cart[product] = {
      ...applyDiscountToProduct(
        product,
        quantity,
        calculateDiscount(cart, totalQuantity)
      ),
      isGift,
    };

    totalQuantity += quantity;
  }

  const subtotal = calculateCartTotal(cart);
  const discount = calculateDiscount(cart, totalQuantity);
  const shippingFee = calculateShippingFee(totalQuantity);
  const giftWrapFeeTotal = Object.values(cart).reduce(
    (total, product) => total + (product.isGift ? product.quantity * giftWrapFee : 0),
    0
  );
  const totalAmount =
    subtotal - discount + shippingFee + giftWrapFeeTotal;

  console.log("===== Receipt =====");
  for (const product in cart) {
    const { quantity, totalAmount, discounted, isGift } = cart[product];
    console.log(
      `${product} - Quantity: ${quantity}, ${
        discounted ? "Discounted " : ""
      }Total: $${totalAmount.toFixed(2)}, Gift Wrap: ${
        isGift ? `$${quantity * giftWrapFee}` : "No"
      }`
    );
  }

  console.log("\nSubtotal: $" + subtotal.toFixed(2));
  console.log(`Discount Applied: ${discount}% (-$${discount.toFixed(2)})`);
  console.log("Shipping Fee: $" + shippingFee.toFixed(2));
  console.log("Gift Wrap Fee: $" + giftWrapFeeTotal.toFixed(2));
  console.log("\nTotal: $" + totalAmount.toFixed(2));
}

// Run the shopping cart program
shoppingCart();
