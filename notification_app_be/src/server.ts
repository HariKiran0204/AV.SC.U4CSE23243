import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v4 as uuid } from "uuid";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const notifications: Array<{ id: string; userId: string; title: string; body: string; createdAt: string; read: boolean }> = [];

app.post("/api/v1/notifications", (req, res) => {
  const { userId, title, body } = req.body;
  if (!userId || !title || !body) return res.status(400).json({ message: "userId, title, body required" });
  const item = { id: uuid(), userId, title, body, createdAt: new Date().toISOString(), read: false };
  notifications.push(item);
  return res.status(201).json(item);
});

app.get("/api/v1/users/:userId/notifications", (req, res) => {
  const data = notifications.filter((n) => n.userId === req.params.userId);
  res.status(200).json(data);
});

app.patch("/api/v1/notifications/:id/read", (req, res) => {
  const item = notifications.find((n) => n.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  item.read = true;
  res.status(200).json(item);
});

const port = Number(process.env.PORT || 4002);
app.listen(port, () => console.log(`notification_app_be running on ${port}`));
