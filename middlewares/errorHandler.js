module.exports = (error, req, res, next) => {
  console.error(error);

  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).send({ message });
};
