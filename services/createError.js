module.exports = (errorMessage, statusCode) => {
    const error = new Error(errorMessage);
    error.statusCode = statusCode || 500;

    throw error;
}