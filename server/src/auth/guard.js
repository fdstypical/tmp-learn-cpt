import { Constants } from "../constants/app.constants.js";
import { db } from "../db/db.js";
import { Token } from "./utils/index.js";

export const AuthGuard = async (req, res, next) => {
  try {
    const isWhiteList = Constants.AUTH_GUARD_WHITELIST.some((p) =>
      req.path.includes(p)
    );

    if (isWhiteList) return next();

    const authorization = req.headers.authorization;
    const [tokenType, token] = authorization?.split(" ") || [];

    if (tokenType !== Constants.TOKEN_TYPE || !token)
      throw new Error("Invalid token type or empty token header");

    const payload = await Token.verify(token);

    const userCandidate = db.get("users").find({ id: payload.id }).value();
    if (!userCandidate) throw new Error("User with this token not found");

    req._user = { ...payload };

    next();
  } catch (e) {
    const status = 401;
    res.status(status).json({ status, message: e.message ?? "Invalid token" });
  }
};
