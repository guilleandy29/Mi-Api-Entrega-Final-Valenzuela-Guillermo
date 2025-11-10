# Ecommerce Backend - Entrega Final (MongoDB)

Proyecto ejemplo con Express + Mongoose + Handlebars para la entrega final.

## Instalación

1. Copiar `.env.sample` a `.env` y configurar `MONGO_URL` y `PORT`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir `http://localhost:8080/products` para ver la vista con paginación.

## Endpoints principales (API)
- GET /api/products?limit=&page=&sort=&query=
- GET /api/products/:pid
- POST /api/products
- PUT /api/products/:pid
- DELETE /api/products/:pid

- POST /api/carts
- GET /api/carts/:cid    (populate products)
- POST /api/carts/:cid/product/:pid
- PUT /api/carts/:cid    (replace cart products array)
- PUT /api/carts/:cid/product/:pid  (update quantity)
- DELETE /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid  (empty cart)

