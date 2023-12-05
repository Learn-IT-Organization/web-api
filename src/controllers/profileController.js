import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { validateToken } from "../middleware/JWT.js";
import Users from "../models/userModel.js";

const profile = async (req, res) => {
  try {
    await validateToken(req, res, () => {});
    const userId = req.authUser.id;
    const user = await Users.findOne({ where: { user_id: userId } });

    if (!user) {
        const errorResponse = {
            success: false,
            data: null,
            err: {
              code: "TOKEN_ERROR",
              msg: "No token was sent!",
            },
            servertime: Date.now(),
          };
          res.status(HTTP_STATUS_CODES.NOT_FOUND).json(errorResponse);
    }

    const responseData = {
      success: true,
      data: {
        id: user.user_id,
        role: user.user_role,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        user_password: user.user_password,
        gender: user.user_gender,
        user_level: user.user_level
      },
      err: null,
      message: "Profile retrieved successfully",
      servertime: Date.now()
    };
    res.json(responseData);
  } catch (err) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: err });
  }
};

export { profile };
