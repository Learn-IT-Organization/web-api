import TeacherRequest from "../models/teacherRequestModel.js";
import Users from "../models/userModel.js";

const validateTeacherRequest = async (req, res, next) => {
  const { request_id, user_id } = req.body;

  try {
    const teacherRequest = await TeacherRequest.findByPk(request_id);

    if (!teacherRequest) {
      return res.status(404).json({ message: "Teacher request not found" });
    }

    if (teacherRequest.is_approved === "accepted") {
      return res
        .status(400)
        .json({ message: "Teacher request is already approved" });
    }

    teacherRequest.is_approved = "accepted";
    await teacherRequest.save();

    const user = await Users.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.user_role = "teacher";
    await user.save();

    res
      .status(200)
      .json({ message: "Teacher request approved and user role updated" });
  } catch (error) {
    console.error("Error validating teacher request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { validateTeacherRequest };
