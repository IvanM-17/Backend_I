import { Router } from "express";
import CartManager from "../managers/cartmanager.js";

const router = Router();
const manager = new CartManager("./src/data/carts.json");

router.get("/", async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/", async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

router.get("/:cid", async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await manager.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

export default router;
