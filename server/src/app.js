import dotenv from "dotenv";
import express from "express";
import jsonServer from "json-server";
import bodyParser from "body-parser";

import { AccessGuard, Expand } from "./utils/index.js";
import { AuthGuard } from "./auth/guard.js";
import { AuthRouter } from "./auth/routes.js";
import { StaticRouter } from "./static/routes.js";
import { CardRouter } from "./card/routes.js";

dotenv.config();

const server = express();
const middlewares = jsonServer.defaults();
const JsonRouter = jsonServer.router("db.json");

server.use(
  AccessGuard({
    post: ["/login", "/register", "/card"],
    patch: false,
    delete: false,
  }),
  Expand({ "/goods": ["category"] })
);
server.use(middlewares);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(AuthGuard);

server.use("/api", JsonRouter);
server.use("/auth", AuthRouter);
server.use("/card", CardRouter);
server.use("/static", StaticRouter);

server.listen(8080);
