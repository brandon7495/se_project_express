const CustomError = require("./CustomError");

class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409);
  }
}

module.exports = ConflictError;
