import express from "express";

import userRoutes from "./modules/users/users.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFound } from "./middlewares/not-found.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Funcionando" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
