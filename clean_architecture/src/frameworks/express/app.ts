import express, { Express } from "express";

const app: Express = express();

// Middlewares
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Load routes dynamically
import userRoutes from "./routes/user.routes";

app.use("/users", userRoutes);

export default app;
export { app };
