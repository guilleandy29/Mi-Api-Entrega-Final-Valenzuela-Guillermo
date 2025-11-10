import Product from '../dao/models/product.model.js';

export const getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort; // 'asc' or 'desc'
    const query = req.query.query; // category or 'available' etc.

    const filter = {};
    if (query) {
      if (query.toLowerCase() === 'available' || query.toLowerCase() === 'disponible') {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }

    const sortObj = {};
    if (sort === 'asc') sortObj.price = 1;
    else if (sort === 'desc') sortObj.price = -1;

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const skip = (page - 1) * limit;

    let docsQuery = Product.find(filter).skip(skip).limit(limit);
    if (sort) docsQuery = docsQuery.sort(sortObj);

    const products = await docsQuery.exec();

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const buildLink = (p) => {
      if (!p) return null;
      const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      url.searchParams.set('page', p);
      url.searchParams.set('limit', limit);
      if (sort) url.searchParams.set('sort', sort);
      if (query) url.searchParams.set('query', query);
      return url.pathname + url.search;
    };

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: buildLink(prevPage),
      nextLink: buildLink(nextPage)
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid).exec();
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    const created = await Product.create(payload);
    res.status(201).json({ status: 'success', payload: created });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const updates = { ...req.body };
    if (updates.id) delete updates.id;
    const updated = await Product.findByIdAndUpdate(pid, updates, { new: true }).exec();
    if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const deleted = await Product.findByIdAndDelete(pid).exec();
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};
