import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

const register = (req, res) => {
  const {
    user_role,
    first_name,
    last_name,
    user_name,
    user_password,
    gender,
    user_level,
  } = req.body;
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
        res.json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: err });
        }
      });
  });
};

export { register };
