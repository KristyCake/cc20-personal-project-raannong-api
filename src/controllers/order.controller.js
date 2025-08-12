import { createOrderFromCart, getAllOrdersService, getOrderByIdService } from "../services/order.service.js";


export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const order = await createOrderFromCart(userId);
    res.status(201).json({ msg: "order created", order });
  } catch (err) {
    console.error("❌ สร้าง order ล้มเหลว:", err.message);
    if (err.message === "Cart is empty") {
      return res.status(409).json({ msg: "Cart is empty" });
    }
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

// export async function getOrdersByUserId(req, res) {
//   try {
//     const { userId } = req.params;
//     const orders = await getOrdersByUserIdService(Number(userId));
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// }

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
}
