import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.user_name, id: user.user_id },
    "jwtsecretplschange"
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, "jwtsecretplschange");
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
