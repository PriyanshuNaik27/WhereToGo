// it will make an method and export it;


// here asyncHandler is higher order functiopn
//A higher-order function is a function that takes another function as an argument and possibly returns a new function.
// A higher-order function to wrap async route handlers
const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            });
        }
    };
};

export { asyncHandler };
