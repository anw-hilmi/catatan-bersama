import ClientError from "../exceptions/clientError.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server kami",
  });
};

export default errorMiddleware;
