import { expressjwt } from "express-jwt";

export const requireSigin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
