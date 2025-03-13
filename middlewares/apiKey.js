const SECRET_API_KEY = process.env.SECRET_API_KEY;

// Middleware to check API Key
module.exports.apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.query.api_key || req.headers["x-api-key"];
    if (apiKey !== SECRET_API_KEY) {
        return res.status(401).json({ message: "Unauthorized: Invalid API Key" });
    }
    next();
};