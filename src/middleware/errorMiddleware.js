import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import CustomError from "../constants/errors.js";

const errorHandlerMiddleware = (err, req, res) => {
  console.error(err.stack);
  const error = new CustomError();
  res.status(error.statusCode).json(error.toJSON());
};

export default errorHandlerMiddleware;
