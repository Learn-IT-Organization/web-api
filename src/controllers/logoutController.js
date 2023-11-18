import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import bcrypt from "bcrypt";
import { createTokens } from "../middleware/JWT.js";

const logout = async (req, res) => {
  try {
    res.clearCookie("access-token");

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal Server Error" });
  }
};
export { logout };
