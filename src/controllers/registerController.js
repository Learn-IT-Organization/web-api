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
    user_photo,
    streak, 
  } = req.body;

  try {
    const existingUser = await Users.findOne({
      where: { user_name: user_name },
    });
    if (existingUser) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(user_password, 10);

    await Users.create({
      user_role: user_role,
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      user_password: hashedPassword,
      gender: gender,
      user_level: user_level,
      user_photo: user_photo,
      streak: streak,
    });

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: err.message || "Error registering user" });
  }
};

export { register };
