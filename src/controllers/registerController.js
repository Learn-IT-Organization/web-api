import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import multer from "multer";

// Create a multer storage instance
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Your registration route
const register = async (req, res) => {
  console.log("Request Body Size:", req.get("Content-Length"));

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

    // Check if a file is uploaded
    const user_photo = req.file ? req.file.buffer.toString("base64") : null;
    console.log("Received user_photo:", user_photo);

    const hashedPassword = await bcrypt.hash(user_password, 10);

    await Users.create({
      user_role: user_role,
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      user_password: hashedPassword,
      gender: gender,
      user_level: user_level,
      user_photo: user_photo,
      streak: streak,
    });

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: err.message || "Error registering user" });
  }
};

// Use multer middleware for handling file uploads
const uploadMiddleware = upload.single("user_photo");

export { register , uploadMiddleware};
