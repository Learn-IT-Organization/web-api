import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const checkUserRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.authUser || !req.authUser.role) {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ error: "User role not specified" });
    }

    const userRole = req.authUser.role;

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(HTTP_STATUS_CODES.FORBIDDEN)
        .json({ error: "Insufficient permissions" });
    }

    next();
  };
};

export { checkUserRole };
