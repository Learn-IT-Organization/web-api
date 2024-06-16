import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { validateToken } from "../middleware/JWT.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { pass } from "../../config/config.js";
import nodemailer from "nodemailer";

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

export { profile, editUserProfile, generateResetCodeAndSendToUser, changePasswordWithResetCode};
