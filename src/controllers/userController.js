import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import bcrypt from "bcrypt";
import { pass } from "../../config/config.js";
import nodemailer from "nodemailer";
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
        user_id: user.user_id,
        user_role: user.user_role,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        user_password: user.user_password,
        gender: user.user_gender,
        user_level: user.user_level,
        user_photo: user.user_photo,
        streak: user.streak,
        last_response_time: user.last_response_time,
      },
      err: null,
      message: "Profile retrieved successfully",
      servertime: Date.now(),
    };
    console.log(responseData);
    res.json(responseData);
  } catch (err) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: err });
  }
};

const editUserProfile = async (req, res) => {
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
  res.json({
    success: true,
    message: "Profile updated successfully",
  });
};

const generateResetCodeAndSendToUser = async (req, res) => {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;

  const user = await Users.findOne({ where: { user_name: userName } });

  if (!user) {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000);

  await Users.update(
    { reset_code: resetCode },
    { where: { user_name: userName } }
  );

  sendResetCodeToUser(resetCode, userEmail);

  res.json({
    success: true,
    message: "Reset code generated and sent to user",
  });
};

const sendResetCodeToUser = async (resetCode, userEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "learnitapp2024@gmail.com",
      pass: pass,
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: userEmail,
    subject: "Password Reset",
    html: `
      <p style="font-size: 24px; color: #6E528B; font-weight: bold;">Your 6-digit reset code is:</p>
      <p style="font-size: 24px; color: #007BFF; font-weight: bold;">${resetCode}</p>
      <p style="font-size: 14px;">Please use this code to reset your password. We hope you enjoy using our LearnIT app! &#127891; </p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const changePasswordWithResetCode = async (req, res) => {
  const { userName, resetCode, newPassword } = req.body;

  const user = await Users.findOne({ where: { user_name: userName } });

  if (!user) {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });
  }
  console.log(user.reset_code, resetCode);
  if (user.reset_code != resetCode) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid reset code",
    });
  }

  user.user_password = bcrypt.hashSync(newPassword, 10);
  user.reset_code = null;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
};

export { login, logout, register, createUser, getAllUsers, getUserById, profile, editUserProfile, generateResetCodeAndSendToUser, changePasswordWithResetCode};
