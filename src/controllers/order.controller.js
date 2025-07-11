import { createOrderFromCart, getAllOrdersService, getOrderByIdService, getOrdersByUserIdService } from "../services/order.service.js";


export async function createOrder(req, res) {
  try {
    const userId = req.user.id; // จาก auth middleware
    // เรียกใช้ service เพื่อสร้างออเดอร์
    const order = await createOrderFromCart(userId);
    res.status(201).json({ msg: "order created", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
}


export async function getAllOrders(req, res) {
  try {
    const orders = await getAllOrdersService();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(Number(id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
}

export async function getOrdersByUserId(req, res) {
  try {
    const { userId } = req.params;
    const orders = await getOrdersByUserIdService(Number(userId));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
}