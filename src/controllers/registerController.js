import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const {
    user_role,
    first_name,
    last_name,
    user_name,
    user_password,
    gender,
    user_level,
  } = req.body;
  const existingUser = await Users.findOne({ where: { user_name: user_name } });
  if (existingUser) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ success: false, error: "User already exists" });
  }
  bcrypt.hash(user_password, 10).then((hash) => {
    Users.create({
      user_role: user_role,
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      user_password: hash,
      gender: gender,
      user_level: user_level,
    })
      .then(() => {
        res.json({ success: true, message: "User registered" });
      })
      .catch((err) => {
        if (err) {
          res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: err });
        }
      });
  });
};

export { register };
