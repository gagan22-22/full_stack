import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Product from "./models/Product.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb+srv://gagandeep2003singh:123singh@cluster0.neb0m.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/products/search", async (req, res) => {
  const q = req.query.q || "";
  const products = await Product.find({
    name: { $regex: q, $options: "i" }
  });
  res.json(products);
});

// Add product
app.post("/api/products", async (req, res) => {
  const { name, price } = req.body;
  const product = new Product({ name, price });
  await product.save();
  res.json({ message: "Product added", product });
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  const { name, price } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price });
  res.json({ message: "Product updated" });
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
