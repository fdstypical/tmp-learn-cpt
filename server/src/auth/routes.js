import express from "express";
import { db } from "../db/index.js";
import { Crypto } from "./utils/crypto.js";
import { Token } from "./utils/tokens.js";

const AuthRouter = express.Router();

AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.length || !password?.length)
    return res.status(400).json({ status: 400, message: "Invalid body" });

  try {
    const candidate = db.get("users").find({ email }).value();

    if (!candidate?.password?.length)
      throw new Error("User with this email not found");

    const isEqualPass = await Crypto.compare(candidate.password, password);

    if (!isEqualPass) throw new Error("Invalid password");

    const { id } = candidate;
    res.status(200).json({
      access: Token.sign({ id, email }),
    });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: e.message ?? "Invalid data provided" });
  }
});

AuthRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (
    !email?.length ||
    !password?.length ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  )
    return res.status(400).json({ status: 400, message: "Invalid body" });

  try {
    const users = db.get("users").value();
    const ids = users.map(({ id }) => id);
    const maxId = Math.max.apply(null, ids);

    if (users.find((u) => u.email == email))
      throw new Error("User with this email already exist");

    const registered = {
      id: Number.isInteger(maxId) ? maxId + 1 : 1,
      email,
      password: await Crypto.hash(password),
    };

    db.get("users").push(registered).write();

    const { id } = registered;
    res.status(200).json({
      user: registered,
      access: Token.sign({ id, email }),
    });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: e.message ?? "Invalid data provided" });
  }
});

export { AuthRouter };
