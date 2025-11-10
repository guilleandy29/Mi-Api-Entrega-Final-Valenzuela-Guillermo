import Cart from '../dao/models/cart.model.js';
import Product from '../dao/models/product.model.js';

export const createCart = async (req, res, next) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

export const getCartProducts = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate('products.product').exec();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart.products });
  } catch (err) {
    next(err);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid).exec();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    const product = await Product.findById(pid).exec();
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated.products });
  } catch (err) {
    next(err);
  }
};

export const updateCartProducts = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const productsArray = req.body.products; // expected [{product: id, quantity: n}, ...]
    const cart = await Cart.findById(cid).exec();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    // replace products
    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated.products });
  } catch (err) {
    next(err);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid).exec();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (!existing) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en carrito' });

    existing.quantity = quantity;
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated.products });
  } catch (err) {
    next(err);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid).exec();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).exec();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    cart.products = [];
    await cart.save();
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};
