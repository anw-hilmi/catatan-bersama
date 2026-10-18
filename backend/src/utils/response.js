const sendSuccessResponse = (
  res,
  data = null,
  message = "Berhasil",
  statusCode = 200,
) => {
  const response = {
    status: "success",
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export default sendSuccessResponse;
