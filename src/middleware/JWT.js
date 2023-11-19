import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { jwtSecret } from "../constants/secrets.js";

const createTokens = (user, req) => {
  const userAgent = req.headers["user-agent"] || "";
  const payload = {
    username: user.user_name,
    id: user.user_id,
    userAgent: userAgent,
  };
  const accessToken = sign(payload, jwtSecret, { expiresIn: "30d" });

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, jwtSecret);
    if (validToken) {
      req.authUser = {
        id: validToken.id,
        username: validToken.username,
      };
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: err });
  }
};

export { createTokens, validateToken };
