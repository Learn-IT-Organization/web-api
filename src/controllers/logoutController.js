import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const logout = (req, res) => {
  try {
    // Törlés az "access-token" cookie-ból
    res.clearCookie("access-token");

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    if (!res.headersSent) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
};

export { logout };
