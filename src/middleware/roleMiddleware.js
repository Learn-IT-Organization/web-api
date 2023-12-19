import { validateTokenAndRole } from "./JWT.js";

const validateAdmin = (req, res, next) => {
  validateTokenAndRole(req, res, next, "admin");
};

const validateTeacher = (req, res, next) => {
  validateTokenAndRole(req, res, next, "teacher", "admin");
};

const validateStudent = (req, res, next) => {
  validateTokenAndRole (req, res, next, "teacher", "admin", "student");
};

export { validateTeacher, validateAdmin, validateStudent };
