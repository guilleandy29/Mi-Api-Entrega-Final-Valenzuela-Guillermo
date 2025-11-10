import { Router } from "express";
import productModel from "../dao/models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean(); // trae productos desde Mongo
    res.render("index", { products });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

export default router;
