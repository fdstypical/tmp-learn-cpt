import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const dirPath = path.join(process.cwd(), "static");

const files = await fs.promises.readdir(dirPath);

await Promise.all(
  files.map((file) =>
    fs.promises.rename(
      path.join(process.cwd(), "static", file),
      path.join(
        process.cwd(),
        "static",
        `${randomBytes(8).toString("hex")}.png`
      )
    )
  )
);
