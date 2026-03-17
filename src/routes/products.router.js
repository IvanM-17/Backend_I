import { Router } from "express";
import ProductDAO from "../dao/product.dao.js";
import { getIO } from "../socket.js";

const router = Router();
const productManager = new ProductDAO();

//Get Router
router.get("/", async (req, res) => {
  try {
    const result = await productManager.getProducts({
      limit: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      sort: req.query.sort,
      query: req.query.query
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Post Router
router.post("/", async (req, res) => {
  try {
    console.log("BODY RECIBIDO:", req.body);

    const newProduct = await productManager.addProduct(req.body);
  
    const updatedProducts = await productManager.getProducts({
      limit: 100,
      page: 1
    });

    const io = getIO();
    io.emit("updateProducts", updatedProducts.payload);

    res.status(201).json(newProduct);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete Router
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await productManager.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedProducts = await productManager.getProducts({
      limit: 100,
      page: 1
    });

    const io = getIO();
    io.emit("updateProducts", updatedProducts.payload);

    res.json({ message: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;