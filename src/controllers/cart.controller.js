import { addCartItem, deleteCartItem, getCart, updateCartItem } from "../services/cart.service.js";

export async function cart(req, res) {
  try {
    const userId = req.user.id;
    console.log("userId:", userId);
    const cart = await getCart(userId);
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function createCart(req, res) {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ msg: "product_id and quantity required" });
    }
    await addCartItem(userId, product_id, quantity);
    res.json({ msg: "add success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
}

export async function patchCartItem(req, res) {
  try {
    const cartItemId = +req.params.id;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: "Quantity must be at least 1" });
    }
    await updateCartItem(cartItemId, quantity);
    res.json({ msg: "update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
}

export async function removeCartItem(req, res) {
  try {
    const cartItemId = +req.params.id;
    await deleteCartItem(cartItemId);
    res.json({ msg: "delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
}