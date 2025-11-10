import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", // nombre de la colección de productos
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

// ⚡ Esto permite que los "populate" funcionen automáticamente
cartSchema.pre("findOne", function() {
  this.populate("products.product");
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
