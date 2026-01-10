const CustomError = require("./CustomError");

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
