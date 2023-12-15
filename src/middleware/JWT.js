import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { jwtSecret } from "../constants/secrets.js";

const createTokens = (user, req) => {
  const userAgent = req.headers["user-agent"] || "";
  const payload = {
    username: user.user_name,
    id: user.user_id,
    role: user.user_role,
    userAgent: userAgent,
  };

  const expiresIn = "30d";
  const accessToken = sign(payload, jwtSecret, { expiresIn });

  const decodedToken = verify(accessToken, jwtSecret);
  const expiresAt = decodedToken.exp;

  return { accessToken, expiresAt };
};

const validateToken = (req, res, next, ...roles) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken)
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: "User not Authenticated!" });

  const validToken = verify(accessToken, jwtSecret);
  if (validToken) {
    req.authUser = {
      id: validToken.id,
      username: validToken.username,
      role: validToken.role,
    };
    req.authenticated = true;
    if (roles.length == 0 || !roles.includes(validToken.role)) {
      return res
        .status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({ error: "Insufficient permissions" });
    }
    return next();
  }
};

export { createTokens, validateToken };
