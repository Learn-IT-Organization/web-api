import { validateToken } from "./JWT.js";

const validateAdmin = (req, res, next) => {
  validateToken(req, res, next, "admin");
};

const validateTeacher = (req, res, next) => {
  validateToken(req, res, next, "teacher", "admin");
};

const validateStudent = (req, res, next) => {
  validateToken(req, res, next, "teacher", "admin", "student");
};

export { validateTeacher, validateAdmin, validateStudent };
