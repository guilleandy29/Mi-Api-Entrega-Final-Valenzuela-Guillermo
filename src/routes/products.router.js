import { Router } from "express";
import productModel from "../dao/models/product.model.js";

const router = Router();

router.get("/views", async (req, res) => {
try {
    // 🔹 Tomamos los parámetros de la URL
    const { page = 1, limit = 10 } = req.query;
    const products = await productModel.paginate({}, { page, limit, lean: true });
    
    // 🔹 Armamos el filtro
    let filter = {};
    if (query) {
      // permite buscar por categoría o por disponibilidad
    filter = { $or: [{ category: query }, { status: query === "true" }] };
    }

    // 🔹 Armamos la opción de orden
    let sortOption = {};
    if (sort === "asc") sortOption = { price: 1 };
    if (sort === "desc") sortOption = { price: -1 };

    // 🔹 Ejecutamos la paginación
    const result = await productModel.paginate(filter, {
    limit,
    page,
    sort: sortOption,
    lean: true
    });

    // 🔹 Creamos los links de navegación
    const baseUrl = "http://localhost:8080/api/products";
    const prevLink = result.hasPrevPage
    ? `${baseUrl}?page=${result.prevPage}&limit=${limit}`
    : null;
    const nextLink = result.hasNextPage
    ? `${baseUrl}?page=${result.nextPage}&limit=${limit}`
    : null;

    // 🔹 Respondemos con el formato solicitado
    res.send({
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink,
    nextLink
    });
} catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: "Error al listar productos" });
}
});

export default router;