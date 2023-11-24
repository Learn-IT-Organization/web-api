class CustomError extends Error {
  constructor(message, statusCode = 500, errorType = "InternalServerError") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorType = errorType;
  }

  toJSON() {
    return {
      errorType: this.errorType,
      errorMessage: this.message,
      statusCode: this.statusCode,
    };
  }
}

class RecordNotFoundError extends CustomError {
  constructor(pk) {
    super(`Record with ID ${pk} not found.`, 404, "NotFound");
  }
}

export default {
  CustomError,
  RecordNotFoundError,
};
