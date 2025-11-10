import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

dotenv.config();

// Configurar __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Rutas
app.use("/", viewsRouter);

// Routers principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Conexión a MongoDB
const MONGO_URL = process.env.MONGO_URL;
console.log("🔍 MONGO_URL:", MONGO_URL);

mongoose
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error al conectar MongoDB", err));

  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
