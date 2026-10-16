import express from "express";
import userRoutes from "./modules/users/users.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Funcionando" });
});

app.use("/api/users", userRoutes);

export default app;
