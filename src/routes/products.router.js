import { Router } from "express";
import ProductManager from "../managers/productmanager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Producto Inexistente" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    price === undefined ||
    stock === undefined ||
    !category ||
    !Array.isArray(thumbnails)
  ) {
    return res.status(400).json({ error: "Completar Campos Obligatorios" });
  }

  const product = await manager.addProduct({
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails
  });

  res.status(201).json(product);
});

router.put("/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: "Producto Inexistente" });
  res.json(updated);
});

router.delete("/:pid", async (req, res) => {
  const deleted = await manager.deleteProduct(req.params.pid);
  if (!deleted) {
    return res.status(404).json({ error: "Producto Inexistente" });
  }
  res.json({ message: "Producto Eliminado" });
});

export default router;
