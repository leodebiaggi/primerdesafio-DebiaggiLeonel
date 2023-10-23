export const errorMiddlewares = (error, req, res, next) => {
    res.send({
      status: "Error",
      message: error.message,
    });
};