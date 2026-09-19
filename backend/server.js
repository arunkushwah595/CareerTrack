const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "CareerTrack API is running"
    });
});

app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

if (require.main === module) {
    connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;