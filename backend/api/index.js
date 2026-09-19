const app = require("../server");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        return res.status(503).json({
            message: "Database connection unavailable"
        });
    }
};