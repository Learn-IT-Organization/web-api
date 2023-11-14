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
      .json({ error: "User Doesn't Exist" });

  const dbPassword = user.user_password;
  bcrypt.compare(user_password, dbPassword).then((match) => {
    if (!match) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      res.json("LOGGED IN");
    }
  });
};

export { 
    login
};
