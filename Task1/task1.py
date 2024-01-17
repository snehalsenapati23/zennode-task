product_prices = {
    "Product A": 20,
    "Product B": 40,
    "Product C": 50,
}

discount_rules = {
    "flat_10_discount": lambda cart_total: 10 if cart_total > 200 else 0,
    "bulk_5_discount": lambda quantity: 0.05 if quantity > 10 else 0,
    "bulk_10_discount": lambda total_quantity: 0.1 if total_quantity > 20 else 0,
    "tiered_50_discount": lambda total_quantity, quantity: 0.5 if total_quantity > 30 and quantity > 15 else 0,
}

gift_wrap_fee = 1
shipping_fee_per_package = 5
units_per_package = 10

def calculate_discount(cart, total_quantity):
    applicable_discounts = [
        discount_rules[rule](total_quantity, cart[rule])
        for rule in discount_rules
        if discount_rules[rule](total_quantity, cart[rule]) > 0
    ]
    return max(applicable_discounts) if applicable_discounts else 0

def calculate_cart_total(cart):
    return sum(cart[product]["total_amount"] for product in cart)

def calculate_shipping_fee(total_quantity):
    return ((total_quantity - 1) // units_per_package + 1) * shipping_fee_per_package

def apply_discount_to_product(product, quantity, discount):
    discounted_price = product_prices[product] * (1 - discount)
    return {
        "quantity": quantity,
        "total_amount": discounted_price * quantity,
        "discounted": discount > 0,
    }

def shopping_cart():
    cart = {}
    total_quantity = 0

    for product in product_prices:
        quantity = int(input(f"Enter quantity for {product}: "))
        is_gift = input(f"Is {product} wrapped as a gift? (yes/no)").lower() == "yes"

        cart[product] = apply_discount_to_product(
            product,
            quantity,
            calculate_discount(cart, total_quantity)
        )
        cart[product]["is_gift"] = is_gift

        total_quantity += quantity

    subtotal = calculate_cart_total(cart)
    discount = calculate_discount(cart, total_quantity)
    shipping_fee = calculate_shipping_fee(total_quantity)
    gift_wrap_fee_total = sum(
        product["quantity"] * gift_wrap_fee
        for product in cart.values()
        if product["is_gift"]
    )
    total_amount = subtotal - discount + shipping_fee + gift_wrap_fee_total

    print("===== Receipt =====")
    for product in cart:
        details = cart[product]
        print(
            f"{product} - Quantity: {details['quantity']}, "
            f"{'Discounted ' if details['discounted'] else ''}Total: ${details['total_amount']:.2f}, "
            f"Gift Wrap: {'$' + str(details['quantity'] * gift_wrap_fee) if details['is_gift'] else 'No'}"
        )

    print("\nSubtotal: $" + f"{subtotal:.2f}")
    print(f"Discount Applied: {discount}% (-${discount:.2f})")
    print("Shipping Fee: $" + f"{shipping_fee:.2f}")
    print("Gift Wrap Fee: $" + f"{gift_wrap_fee_total:.2f}\n")
    print("Total: $" + f"{total_amount:.2f}")

# Run the shopping cart program
shopping_cart()
