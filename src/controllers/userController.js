import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import bcrypt from "bcrypt";
import { RecordNotFoundError } from "../constants/errors.js";
import { validateToken, createTokens } from "../middleware/JWT.js";

const login = async (req, res) => {
  const { user_name, user_password } = req.body;
  const user = await Users.findOne({ where: { user_name: user_name } });

  if (!user) {
    const errorResponse = {
      success: false,
      data: null,
      err: {
        code: "SERVICE_CODE",
        msg: "ERR_USER_NOT_FOUND",
      },
      servertime: Date.now(),
    };
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json(errorResponse);
    return; 
  }

  const dbPassword = user.user_password;

  if (!dbPassword) {
    const errorResponse = {
      success: false,
      data: null,
      err: {
        code: "SERVICE_CODE",
        msg: "ERR_INVALID_PASSWORD",
      },
      servertime: Date.now(),
    };
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(errorResponse);
    return; 
  }

  bcrypt.compare(user_password, dbPassword).then((match) => {
    if (!match) {
      const errorResponse = {
        success: false,
        data: null,
        err: {
          code: "SERVICE_CODE",
          msg: "ERR_INVALID_PASSWORD",
        },
        servertime: Date.now(),
      };
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(errorResponse);
    } else {
      const { accessToken, expiresAt } = createTokens(user, req);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: false,
        secure: false,
      });

      const successResponse = {
        success: true,
        data: {
          name: "token",
          value: accessToken,
          expires: expiresAt,
        },
        err: null,
        message: "Logged in successfully",
        servertime: Date.now(),
      };
      res.json(successResponse);
    }
  });
};

const logout = (req, res) => {
  try {
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

const register = async (req, res) => {
  const {
    user_role,
    first_name,
    last_name,
    user_name,
    user_password,
    gender,
    user_level,
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
      streak: streak,
    });

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: err.message || "Error registering user" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(user);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const users = await Users.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(users);
};

const getUserById = async (req, res) => {
  await validateToken(req, res, () => {});
  const userId = req.authUser.id;
  const user = await Users.findByPk(userId);
  if (user != null) {
    res.status(HTTP_STATUS_CODES.OK).json(user);
  } else {
    const error = new RecordNotFoundError(userId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

export { login, logout, register, createUser, getAllUsers, getUserById };
