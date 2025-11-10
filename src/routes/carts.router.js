import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";

const router = Router();

// ✅ Crear un nuevo carrito
router.post("/", async (req, res) => {
try {
    const newCart = await cartModel.create({ products: [] });
    res.json({ status: "success", message: "Carrito creado", cart: newCart });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

// ✅ Obtener los productos de un carrito
router.get("/:cid", async (req, res) => {
try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid).populate("products.product");

    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    res.json({ status: "success", cart });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

// ✅ Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);

    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
    existingProduct.quantity += 1;
    } else {
    cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: "success", message: "Producto agregado", cart });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

// ✅ Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await cartModel.findByIdAndUpdate(
    cid,
    { products },
    { new: true }
    ).populate("products.product");

    if (!cart) {
    return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({ status: "success", message: "Carrito actualizado", cart });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

// ✅ Actualizar cantidad de un producto dentro del carrito
router.put("/:cid/products/:pid", async (req, res) => {
try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) return res.status(404).json({ message: "Producto no encontrado en carrito" });

    productInCart.quantity = quantity;
    await cart.save();

    res.json({ status: "success", message: "Cantidad actualizada", cart });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

// ✅ Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", message: "Producto eliminado del carrito", cart });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

// ✅ Vaciar un carrito
router.delete("/:cid", async (req, res) => {
try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", message: "Carrito vaciado" });
} catch (error) {
    res.status(500).json({ status: "error", message: error.message });
}
});

export default router;