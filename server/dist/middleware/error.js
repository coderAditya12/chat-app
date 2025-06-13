const errorHandler = (res, status, message) => {
    res.status(status).json({ message });
};
export default errorHandler;
