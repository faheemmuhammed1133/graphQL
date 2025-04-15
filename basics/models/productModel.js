import mongoose from "mongoose";

const productSchema = mongoose.Schema(
   {
      name: { type:String, required: true },
      price: {type: Number, required: true },
      category: { type:String, required: true },
      quantity: { type:Number, required: true },
      imageUrl: { type:String, required: true },
   },
   { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
export default productModel;
