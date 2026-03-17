import { Router } from "express";
import ProductDAO from "../dao/product.dao.js";
import CartDAO from "../dao/cart.dao.js";

const router = Router();

const productManager = new ProductDAO();
const cartManager = new CartDAO();


router.get("/realtimeproducts", async (req, res) => {
  const result = await productManager.getProducts({ limit: 100, page: 1 });
  res.render("realTimeProducts", { products: result.payload });
});


router.get("/products", async (req, res) => {
  const result = await productManager.getProducts(req.query);

  res.render("products", {
    products: result.payload,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage
  });
});


router.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  res.render("productDetail", { product });
});


router.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  res.render("cart", { cart });
});

export default router;