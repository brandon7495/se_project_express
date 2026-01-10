const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFoundError;
