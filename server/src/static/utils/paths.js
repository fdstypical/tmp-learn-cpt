import path from "node:path";

export const MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

export const STATIC_PATH = path.join(process.cwd(), "./static");
