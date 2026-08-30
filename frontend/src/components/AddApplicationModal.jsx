import { CalendarDays, X } from "lucide-react";
import { useState } from "react";

import api from "../services/api";

import "./AddApplicationModal.css";

function AddApplicationModal({ onClose, onApplicationAdded }) {
    const [formData, setFormData] = useState({
        company: "",
        role: "",
        status: "Applied",
        appliedDate: new Date().toISOString().split("T")[0]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.company.trim()) {
            setError("Company name is required.");
            return;
        }

        if (!formData.role.trim()) {
            setError("Job role is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/applications",
                formData
            );

            onApplicationAdded(response.data);

            onClose();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to add application. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="application-modal-overlay"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !loading
                ) {
                    onClose();
                }
            }}
        >
            <div className="application-modal">

                <div className="application-modal-header">

                    <div>
                        <p className="modal-eyebrow">
                            Career tracking
                        </p>

                        <h2>Add application</h2>

                        <p>
                            Keep your job search organized by
                            recording a new application.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close modal"
                    >
                        <X size={19} />
                    </button>

                </div>


                <form
                    className="application-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-field">

                        <label htmlFor="company">
                            Company
                        </label>

                        <input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="e.g. Google"
                            value={formData.company}
                            onChange={handleChange}
                            disabled={loading}
                            autoFocus
                        />

                    </div>


                    <div className="form-field">

                        <label htmlFor="role">
                            Job role
                        </label>

                        <input
                            id="role"
                            name="role"
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-field">

                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="Applied">
                                    Applied
                                </option>

                                <option value="Online Assessment">
                                    Online Assessment
                                </option>

                                <option value="Interview">
                                    Interview
                                </option>

                                <option value="Rejected">
                                    Rejected
                                </option>

                                <option value="Selected">
                                    Selected
                                </option>
                            </select>

                        </div>


                        <div className="form-field">

                            <label htmlFor="appliedDate">
                                Applied date
                            </label>

                            <div className="date-input-wrapper">

                                <CalendarDays size={16} />

                                <input
                                    id="appliedDate"
                                    name="appliedDate"
                                    type="date"
                                    value={formData.appliedDate}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                            </div>

                        </div>

                    </div>


                    {error && (
                        <div className="application-form-error">
                            {error}
                        </div>
                    )}


                    <div className="application-modal-footer">

                        <button
                            type="button"
                            className="modal-cancel-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="modal-submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner" />
                                    Adding...
                                </>
                            ) : (
                                "Add application"
                            )}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default AddApplicationModal;