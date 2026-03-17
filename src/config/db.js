import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecommerce");
    console.log("Mongo conectado");
  } catch (error) {
    console.error(error);
  }
};