import TeacherRequest from "../models/teacherRequestModel.js";
import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { pass } from "../../config/config.js";
import { validateToken } from "../middleware/JWT.js";
import nodemailer from "nodemailer";

const validateTeacherRequest = async (req, res, next) => {
  const { request_id, user_id } = req.body;
  const teacherRequest = await TeacherRequest.findByPk(request_id);

  if (!teacherRequest) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .json({ message: "Teacher request not found" });
  }

  if (teacherRequest.is_approved === "accepted") {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .json({ message: "Teacher request is already approved" });
  }

  teacherRequest.is_approved = "accepted";
  await teacherRequest.save();

  const user = await Users.findByPk(user_id);

  if (!user) {
    return res
      .status(HTTP_STATUS_CODES.CREATED.NOT_FOUND)
      .json({ message: "User not found" });
  }

  user.user_role = "teacher";
  await user.save();

  await sendValidationStatusEmail(
    teacherRequest.email,
    user.first_name,
    "accepted"
  );

  res
    .status(HTTP_STATUS_CODES.OK)
    .json({ message: "Teacher request approved and user role updated" });
};

const declineTeacherRequest = async (req, res) => {
  const { request_id } = req.body;
  const teacherRequest = await TeacherRequest.findByPk(request_id);

  if (!teacherRequest) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .json({ message: "Teacher request not found" });
  }

  teacherRequest.is_approved = "declined";
  await teacherRequest.save();

  const user = await Users.findByPk(teacherRequest.user_id);

  if (!user) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND)
      .json({ message: "User not found" });
  }

  await sendValidationStatusEmail(
    teacherRequest.email,
    user.first_name,
    "declined"
  );

  res
    .status(HTTP_STATUS_CODES.OK)
    .json({ message: "Teacher request declined" });
};

const createRequest = async (req, res) => {
  try {
    const request = await TeacherRequest.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(request);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllRequests = async (req, res) => {
  const requests = await TeacherRequest.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(requests);
};

const getRequestsByUserId = async (req, res) => {
  await validateToken(req, res, () => {});
  const userId = req.authUser.id;
  const requests = await TeacherRequest.findAll({
    where: {
      user_id: userId,
    },
  });
  res.status(HTTP_STATUS_CODES.OK).json(requests);
};

const sendValidationStatusEmail = async (userEmail, userName, status) => {
  let emailContent = "";

  if (status === "declined") {
    emailContent = `
        <p>Dear ${userName},</p>
        <p>We regret to inform you that your teacher request has been declined.</p>
        <p>If you have any questions, please contact support.</p>
        <p>Best regards,<br/>The LearnIt Team</p>
      </div>
    `;
  } else if (status === "accepted") {
    emailContent = `
        <p>Dear ${userName},</p>
        <p>Congratulations! Your teacher request has been approved.</p>
        <p>You can now access teacher functionalities in the LearnIt app.</p>
        <p>Best regards,<br/>The LearnIt Team</p>
      </div>
    `;
  }

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
    from: "learnitapp2024@gmail.com",
    to: userEmail,
    subject: "Teacher Request Status",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export {
  validateTeacherRequest,
  createRequest,
  getAllRequests,
  declineTeacherRequest,
  getRequestsByUserId,
};
