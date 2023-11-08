import express from "express";
import { MIME_TYPES, prepareFile } from "./utils/index.js";

const StaticRouter = express.Router();

StaticRouter.get("*", async (req, res) => {
  const file = await prepareFile(req.path);
  const status = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;

  res.writeHead(status, { "Content-Type": mimeType });
  file.stream.pipe(res);
});

export { StaticRouter };
