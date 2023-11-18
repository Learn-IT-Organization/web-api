import HTTP_STATUS_CODES from '../constants/httpStatusCodes.js';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
};

export default errorHandlerMiddleware;
