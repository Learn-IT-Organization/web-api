import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { validateToken } from "./JWT.js";

const validateAdmin = (req, res, next) => {
  try {
    validateToken(req, res, () => {
      if (req.authenticated && req.authUser.role === "admin") {
        return next();
      } else {
        return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: "Insufficient permissions" });
      }
    });
  } catch (err) {
    console.error("ValidateAdmin error:", err);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

const validateTeacher = (req, res, next) => {
  try {
    validateToken(req, res, () => {
      if (req.authenticated && (req.authUser.role === "teacher" || req.authUser.role === "admin")) {
        return next();
      } else {
        return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: "Insufficient permissions" });
      }
    });
  } catch (err) {
    console.error("ValidateTeacher error:", err);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

const validateStudent = (req, res, next) => {
  try {
    validateToken(req, res, () => {
      if (req.authenticated && req.authUser.role === "student" || req.authUser.role === "teacher" || req.authUser.role === "admin") {
        return next();
      } else {
        return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ error: "Insufficient permissions" });
      }
    });
  } catch (err) {
    console.error("ValidateStudent error:", err);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

export {
  validateTeacher,
  validateAdmin,
  validateStudent
};