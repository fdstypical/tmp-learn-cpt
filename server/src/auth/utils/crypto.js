import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

export class Crypto {
  static HASH_KEYLEN = 64;

  static async hash(data) {
    const salt = randomBytes(16).toString("hex");
    const buf = await promisify(scrypt)(data, salt, Crypto.HASH_KEYLEN);
    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(stored, supplied) {
    const [hash, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hash, "hex");
    const suppliedBuf = await promisify(scrypt)(
      supplied,
      salt ?? "",
      Crypto.HASH_KEYLEN
    );

    return timingSafeEqual(hashedBuf, suppliedBuf);
  }
}
