import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../env.js";
import { UnauthorizedError } from "../../errors.js";
import * as repo from "./auth.repository.js";
import type { LoginInput } from "./auth.schema.js";

export async function login(input: LoginInput) {
  const user = await repo.findByEmail(input.email);
  // Same generic error for "no user" and "bad password" — don't leak which.
  if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: "8h",
  });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}
