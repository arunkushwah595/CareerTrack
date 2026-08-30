const Application = require("../models/Application");


// GET /api/applications
// Get all applications of logged-in user
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};


// POST /api/applications
// Create application for logged-in user
const createApplication = async (req, res) => {
    try {
        const {
            company,
            role,
            status,
            appliedDate
        } = req.body;

        const application = await Application.create({
            user: req.user.userId,
            company,
            role,
            status,
            appliedDate
        });

        res.status(201).json(application);

    } catch (error) {
        res.status(400).json({
            message: "Failed to create application",
            error: error.message
        });
    }
};


// GET /api/applications/:id
// Get one application belonging to logged-in user
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json(application);

    } catch (error) {
        res.status(400).json({
            message: "Invalid application ID"
        });
    }
};


// PUT /api/applications/:id
// Update user's application
const updateApplication = async (req, res) => {
    try {
        const {
            company,
            role,
            status,
            appliedDate
        } = req.body;

        const application = await Application.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                company,
                role,
                status,
                appliedDate
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json(application);

    } catch (error) {
        res.status(400).json({
            message: "Failed to update application",
            error: error.message
        });
    }
};


// DELETE /api/applications/:id
// Delete user's application
const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid application ID"
        });
    }
};


module.exports = {
    getApplications,
    createApplication,
    getApplicationById,
    updateApplication,
    deleteApplication
};