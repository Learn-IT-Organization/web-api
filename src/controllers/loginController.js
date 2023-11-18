import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import bcrypt from "bcrypt";
import { createTokens } from "../middleware/JWT.js";

const login = async (req, res) => {
  const { user_name, user_password } = req.body;
  const user = await Users.findOne({ where: { user_name: user_name } });
  if (!user)
    res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .json({ success: false, error: "User not found" });

  const dbPassword = user.user_password;
  bcrypt.compare(user_password, dbPassword).then((match) => {
    if (!match) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: "Invalid password" });
    } else {
      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });
      res.json({
        success: true,
        token: accessToken,
        message: "Logged in successfully",
      });
    }
  });
};

export { login };
