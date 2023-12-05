import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import bcrypt from "bcrypt";
import { createTokens } from "../middleware/JWT.js";

const login = async (req, res) => {
  const { user_name, user_password } = req.body;
  const user = await Users.findOne({ where: { user_name: user_name } });

  if (!user) {
    const errorResponse = {
      success: false,
      data: null,
      err: {
        code: "SERVICE_CODE",
        msg: "ERR_USER_NOT_FOUND",
      },
      servertime: Date.now(),
    };
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json(errorResponse);
    return; 
  }

  const dbPassword = user.user_password;

  if (!dbPassword) {
    const errorResponse = {
      success: false,
      data: null,
      err: {
        code: "SERVICE_CODE",
        msg: "ERR_INVALID_PASSWORD",
      },
      servertime: Date.now(),
    };
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(errorResponse);
    return; 
  }

  bcrypt.compare(user_password, dbPassword).then((match) => {
    if (!match) {
      const errorResponse = {
        success: false,
        data: null,
        err: {
          code: "SERVICE_CODE",
          msg: "ERR_INVALID_PASSWORD",
        },
        servertime: Date.now(),
      };
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(errorResponse);
    } else {
      const { accessToken, expiresAt } = createTokens(user, req);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
        secure: true,
      });

      const successResponse = {
        success: true,
        data: {
          name: "token",
          value: accessToken,
          expires: expiresAt,
        },
        err: null,
        message: "Logged in successfully",
        servertime: Date.now(),
      };
      res.json(successResponse);
    }
  });
};

export { login };
