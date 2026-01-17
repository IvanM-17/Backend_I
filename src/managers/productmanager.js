import fs from "fs";
import crypto from "crypto";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    } = product;
    
    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      throw new Error("Faltan campos obligatorios");
    }

    const products = await this.getProducts();

    const newProduct = {
      id: crypto.randomUUID(),          
      title,
      description,
      code,
      price,
      status: typeof status === "boolean" ? status : true,
      stock,
      category,
      thumbnails: Array.isArray(thumbnails) ? thumbnails : []
    };

    products.push(newProduct);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2)
    );

    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    delete updatedFields.id; 

    products[index] = {
      ...products[index],
      ...updatedFields
    };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
  const products = await this.getProducts();
  const exists = products.some(p => p.id === id);
  if (!exists) return false;

  const filtered = products.filter(p => p.id !== id);
  await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2));
  return true;
}
}
