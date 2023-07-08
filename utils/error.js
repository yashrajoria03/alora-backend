export const createError = (status, message) => {
  const error = new Error();
  error.message = message || "something went wrong";
  error.status = status || 500;
  return error;
};
