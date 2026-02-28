import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { getIO } from "../socket.js";
import path from "path";

const productManager = new ProductManager(
  path.resolve("./src/data/products.json")
);

const router = Router();


router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
})

router.post("/", async (req, res) => {
    console.log("BODY RECIBIDO:", req.body);

    await productManager.addProduct(req.body);

    const products = await productManager.getProducts();

    const io = getIO();
    io.emit("updateProducts", products);

    res.json({ message: "Producto agregado" });
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await productManager.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const products = await productManager.getProducts();

    const io = getIO();
    io.emit("updateProducts", products);

    res.json({ message: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router