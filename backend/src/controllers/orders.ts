import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
const router = Router();
let store: any[] = [];

router.post("/", (req, res) => {
  const id = store.length + 1;
  const order = { id, uuid: uuidv4(), status: "pending", created_at: new Date().toISOString(), ...req.body };
  store.push(order);
  if ((globalThis as any).io) (globalThis as any).io.emit("order.created", order);
  res.status(201).json(order);
});

router.get("/", (req, res) => {
  const { status } = req.query;
  const data = status ? store.filter(o => o.status === status) : store;
  res.json(data);
});

router.patch("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const order = store.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: "not found" });
  const from = order.status;
  order.status = req.body.status || order.status;
  order.updated_at = new Date().toISOString();
  if ((globalThis as any).io) (globalThis as any).io.emit("order.status_changed", { id: order.id, from, to: order.status, changed_at: order.updated_at });
  if (order.status === "completed" && (globalThis as any).io) (globalThis as any).io.emit("order.completed", { id: order.id, completed_at: order.updated_at, payment: order.payment || null });
  res.json(order);
});

export default router;

