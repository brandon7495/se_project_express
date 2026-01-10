const CustomError = require("./CustomError");

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
