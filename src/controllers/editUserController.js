import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import bcrypt from "bcrypt";
import { createTokens } from "../middleware/JWT.js";

const editUserProfile = async (req, res) => {
  try {
    const updateFields = req.body;
    const userId = req.authUser.id;

    const user = await Users.findByPk(userId);

    if (!user) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ success: false, error: "User not found" });
    }

    Object.keys(updateFields).forEach((field) => {
      if (field === "user_password") {
        user[field] = bcrypt.hashSync(updateFields[field], 10);
      } else {
        user[field] = updateFields[field];
      }
    });

    await user.save();

    const accessToken = createTokens(user);

    res.cookie("access-token", accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
    });

    res.json({
      success: true,
      token: accessToken,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export { editUserProfile };
