const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((error) => {
            connectionPromise = undefined;
            console.error("MongoDB connection failed:", error.message);
            throw error;
        });

    try {
        await connectionPromise;
    } catch (error) {
        throw error;
    }
};

module.exports = connectDB;