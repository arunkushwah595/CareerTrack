const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },

        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: [2, "Company name must be at least 2 characters"]
        },

        role: {
            type: String,
            required: [true, "Job role is required"],
            trim: true,
            minlength: [2, "Job role must be at least 2 characters"]
        },

        status: {
            type: String,
            enum: {
                values: [
                    "Applied",
                    "Online Assessment",
                    "Interview",
                    "Rejected",
                    "Selected"
                ],
                message: "Invalid application status"
            },
            default: "Applied"
        },

        appliedDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;