import express from "express";
import { db } from "../db/index.js";

const CardRouter = express.Router();

CardRouter.post("/", (req, res) => {
  const { id } = req._user;
  const { goodId } = req.body;

  if (!Number.isInteger(goodId))
    return res.status(400).json({ status: 400, message: "Invalid body" });

  try {
    const isAlredyExist = db
      .get("cardItems")
      .find({ userId: id, goodId })
      .value();

    if (isAlredyExist)
      throw new Error("This good has already been added to the cart");

    const goodCandidate = db.get("goods").find({ id: goodId }).value();

    if (!goodCandidate) throw new Error("Good not found");

    db.get("cardItems").push({ userId: id, goodId }).write();

    res.status(200).json({ ...goodCandidate });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: e.message ?? "Internal server error" });
  }
});

CardRouter.get("/", (req, res) => {
  const { id } = req._user;

  try {
    const cardItems = db.get("cardItems").filter({ userId: id }).value();
    const uniqIds = [...new Set(cardItems.map(({ goodId }) => goodId))];

    const goods = db
      .get("goods")
      .filter((good) => uniqIds.includes(good.id))
      .value();

    res.status(200).json(goods);
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: e.message ?? "Iternal server error" });
  }
});

export { CardRouter };
