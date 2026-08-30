import {
    BriefcaseBusiness,
    Search,
    Plus,
    SlidersHorizontal,
    MoreHorizontal,
    CalendarDays
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import api from "../services/api";

import AddApplicationModal from "../components/AddApplicationModal";

import "./Applications.css";


function Applications() {

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);


    const fetchApplications = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get("/applications");

            setApplications(
                response.data.applications || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load applications."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchApplications();
    }, []);


    const filteredApplications = useMemo(() => {

        return applications.filter((application) => {

            const matchesSearch =
                application.company
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                application.role
                    ?.toLowerCase()
                    .includes(search.toLowerCase());


            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;


            return matchesSearch && matchesStatus;

        });

    }, [
        applications,
        search,
        statusFilter
    ]);


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    const getStatusClass = (status) => {

        switch (status) {

            case "Interview":
                return "interview-status";

            case "Online Assessment":
                return "assessment-status";

            case "Selected":
                return "selected-status";

            case "Rejected":
                return "rejected-status";

            default:
                return "applied-status";
        }
    };


    return (
        <div className="applications-page">

            <div className="applications-page-header">

                <div className="applications-title">

                    <div className="applications-title-icon">
                        <BriefcaseBusiness size={19} />
                    </div>

                    <div>

                        <h1>
                            Applications
                        </h1>

                        <p>
                            Track and manage your job
                            applications in one place.
                        </p>

                    </div>

                </div>


                <button
                    className="applications-add-button"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={15} />

                    Add application
                </button>

            </div>


            <div className="applications-toolbar">

                <div className="applications-search">

                    <Search size={15} />

                    <input
                        type="text"
                        placeholder="Search company or role..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                <div className="applications-filter">

                    <SlidersHorizontal size={14} />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >

                        <option value="All">
                            All statuses
                        </option>

                        <option value="Applied">
                            Applied
                        </option>

                        <option value="Online Assessment">
                            Online Assessment
                        </option>

                        <option value="Interview">
                            Interview
                        </option>

                        <option value="Selected">
                            Selected
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>

                </div>

            </div>


            <div className="applications-card">

                <div className="applications-card-header">

                    <div>

                        <h2>
                            All applications
                        </h2>

                        <span>
                            {filteredApplications.length}
                            {" "}
                            {filteredApplications.length === 1
                                ? "application"
                                : "applications"}
                        </span>

                    </div>

                </div>


                {loading ? (

                    <div className="applications-page-loading">

                        {Array.from({ length: 5 }).map(
                            (_, index) => (
                                <div
                                    className="page-skeleton-row"
                                    key={index}
                                >
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            )
                        )}

                    </div>

                ) : error ? (

                    <div className="applications-page-empty">

                        <div className="applications-empty-icon">
                            <BriefcaseBusiness size={20} />
                        </div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={fetchApplications}
                        >
                            Try again
                        </button>

                    </div>

                ) : filteredApplications.length === 0 ? (

                    <div className="applications-page-empty">

                        <div className="applications-empty-icon">
                            <BriefcaseBusiness size={20} />
                        </div>

                        <h3>
                            {applications.length === 0
                                ? "No applications yet"
                                : "No matching applications"}
                        </h3>

                        <p>
                            {applications.length === 0
                                ? "Start tracking your job search by adding your first application."
                                : "Try changing your search or status filter."}
                        </p>

                        {applications.length === 0 && (
                            <button
                                onClick={() =>
                                    setShowModal(true)
                                }
                            >
                                Add application
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="applications-list">

                        <div className="applications-list-header">

                            <span>
                                Company
                            </span>

                            <span>
                                Role
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Applied
                            </span>

                            <span>
                            </span>

                        </div>


                        {filteredApplications.map(
                            (application, index) => (

                                <div
                                    className="application-list-row"
                                    key={application._id}
                                    style={{
                                        animationDelay:
                                            `${index * 45}ms`
                                    }}
                                >

                                    <div className="application-company">

                                        <div className="application-company-logo">
                                            {application.company
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <span>
                                            {application.company}
                                        </span>

                                    </div>


                                    <span className="application-role">
                                        {application.role}
                                    </span>


                                    <span
                                        className={`application-status ${getStatusClass(
                                            application.status
                                        )}`}
                                    >
                                        {application.status}
                                    </span>


                                    <span className="application-date">

                                        <CalendarDays size={13} />

                                        {formatDate(
                                            application.appliedDate
                                        )}

                                    </span>


                                    <button
                                        className="application-more-button"
                                        aria-label={`Actions for ${application.company}`}
                                    >
                                        <MoreHorizontal size={17} />
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {showModal && (
                <AddApplicationModal
                    onClose={() =>
                        setShowModal(false)
                    }
                    onApplicationAdded={() => {
                        fetchApplications();
                    }}
                />
            )}

        </div>
    );
}


export default Applications;