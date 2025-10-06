const created = { status: 201 };
const invalidUser = { status: 400, message: "Invalid User" };
const invalidItem = { status: 400, message: "Invalid Item" };
const invalidEmailOrPassword = {
  status: 401,
  message: "Invalid Email or Password",
};
const notFound = { status: 404, message: "Not Found" };
const serverError = { status: 500, message: "Internal Server Error" };

module.exports = {
  created,
  invalidUser,
  invalidItem,
  invalidEmailOrPassword,
  notFound,
  serverError,
};
