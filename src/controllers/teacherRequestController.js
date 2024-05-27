import TeacherRequest from "../models/teacherRequestModel.js";
import Users from "../models/userModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const validateTeacherRequest = async (req, res, next) => {
  const { request_id, user_id } = req.body;
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

  res
    .status(HTTP_STATUS_CODES.OK)
    .json({ message: "Teacher request declined" });
};

const createRequest = async (req, res) => {
  try {
    const request = await TeacherRequest.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json({ success: true, message: "Request created successfully"});
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ success: false, message: error.message });
  }
}; 

const getAllRequests = async (req, res) => {
  const requests = await TeacherRequest.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(requests);
};

export {
  validateTeacherRequest,
  createRequest,
  getAllRequests,
  declineTeacherRequest,
};
