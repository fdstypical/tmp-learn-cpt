import fs from "node:fs";
import path from "node:path";
import { STATIC_PATH } from "./index.js";

export const toBool = [() => true, () => false];

export const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];
  const filePath = path.join(...paths);

  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);

  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + "/404.jpg";

  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);

  return { found, ext, stream };
};
