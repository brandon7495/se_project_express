const CustomError = require("./CustomError");

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = BadRequestError;
