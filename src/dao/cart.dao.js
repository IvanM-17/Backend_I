import Cart from "../models/Cart.js";

export default class CartDAO {

  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async createCart() {
    return await Cart.create({ products: [] });
  }

  async addProduct(cid, pid) {
    const cart = await Cart.findById(cid);

    const existing = cart.products.find(
      p => p.product.toString() === pid
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }
}