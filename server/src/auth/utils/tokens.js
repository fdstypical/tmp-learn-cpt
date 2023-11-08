import { promisify } from "node:util";
import jwt from "jsonwebtoken";

export class Token {
  static sign(payload) {
    const { SECRET_KEY: secret, EXPIRES_IN: expiresIn } = process.env;
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verify(token) {
    const { SECRET_KEY: secret, EXPIRES_IN: expiresIn } = process.env;
    return promisify(jwt.verify.bind(jwt))(token, secret, { expiresIn });
  }
}
