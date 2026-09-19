import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    TrendingUp,
    X
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Dashboard.css";
import AddApplicationModal from "../components/AddApplicationModal";
import MobileAppHeader from "../components/MobileAppHeader";
import AppSidebar from "../components/AppSidebar";

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState(null);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState("");

    const fetchApplications = async () => {
        try {
            setApplicationsLoading(true);
            setApplicationsError("");

            const [response, userResponse] = await Promise.all([
                api.get("/applications"),
                api.get("/auth/me")
            ]);

            setApplications(response.data || []);
            setUser(userResponse.data.user);

        } catch (error) {
            setApplicationsError(
                error.response?.data?.message ||
                "Unable to load applications."
            );
        } finally {
            setApplicationsLoading(false);
        }
    };

    useEffect(() => {
        const loadApplications = async () => {
            await fetchApplications();
        };

        loadApplications();
    }, []);

    const navigate = useNavigate();

    const [showApplicationModal, setShowApplicationModal] =
        useState(false);

    const totalApplications = applications.length;

    const appliedCount = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    const interviewCount = applications.filter(
        (application) =>
            application.status === "Interview"
    ).length;

    const onlineAssessmentCount = applications.filter(
        (application) =>
            application.status === "Online Assessment"
    ).length;

    const offerCount = applications.filter(
        (application) =>
            application.status === "Selected"
    ).length;

    const rejectedCount = applications.filter(
        (application) =>
            application.status === "Rejected"
    ).length;

    const interviewRate = totalApplications
        ? Math.round((interviewCount / totalApplications) * 100)
        : 0;

    const assessmentRate = totalApplications
        ? Math.round((onlineAssessmentCount / totalApplications) * 100)
        : 0;

    const offerRate = totalApplications
        ? Math.round((offerCount / totalApplications) * 100)
        : 0;

    const rejectionRate = totalApplications
        ? Math.round((rejectedCount / totalApplications) * 100)
        : 0;

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12
        ? "Good morning"
        : currentHour < 18
            ? "Good afternoon"
            : "Good evening";

    const monthlyApplications = useMemo(() => {
        const today = new Date();
        const months = Array.from({ length: 6 }, (_, index) => {
            const date = new Date(
                today.getFullYear(),
                today.getMonth() - (5 - index),
                1
            );

            return {
                label: date.toLocaleDateString("en-US", {
                    month: "short"
                }),
                year: date.getFullYear(),
                month: date.getMonth(),
                count: 0
            };
        });

        applications.forEach((application) => {
            const date = new Date(
                application.appliedDate || application.createdAt
            );

            const month = months.find(
                (entry) =>
                    entry.year === date.getFullYear() &&
                    entry.month === date.getMonth()
            );

            if (month) {
                month.count += 1;
            }
        });

        const maximum = Math.max(
            ...months.map((month) => month.count),
            1
        );

        return months.map((month) => ({
            ...month,
            height: `${Math.max((month.count / maximum) * 100, 8)}%`
        }));
    }, [applications]);

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
        <div className="dashboard-layout">

            <AppSidebar active="dashboard" />


            {/* Main */}
            <div className="dashboard-main">

                <MobileAppHeader />

                {/* Content */}
                <main className="dashboard-content">

                    <section className="welcome-section">

                        <div>
                            <p className="welcome-label">
                                Career overview
                            </p>

                            <h1>
                                {greeting}, {user?.name || "there"}
                            </h1>

                            <p>
                                Here's what's happening with your
                                job search.
                            </p>
                        </div>


                        <button
                            className="add-application-button"
                            onClick={() => setShowApplicationModal(true)}
                        >

                            <BriefcaseBusiness size={17} />

                            Add application

                        </button>

                    </section>


                    {/* Stats */}
                    <section className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <div className="stat-icon purple">
                                    <BriefcaseBusiness size={19} />
                                </div>

                                <span className="stat-change positive">
                                    <TrendingUp size={13} />
                                    {totalApplications ? "100%" : "0%"}
                                </span>

                            </div>

                            <p>Applications</p>

                            <strong>{totalApplications}</strong>

                            <span className="stat-description">
                                Total applications
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <div className="stat-icon assessment">
                                    <ClipboardCheck size={19} />
                                </div>

                                <span className="stat-change positive">
                                    <TrendingUp size={13} />
                                    {assessmentRate}%
                                </span>

                            </div>

                            <p>Online assessments</p>

                            <strong>{onlineAssessmentCount}</strong>

                            <span className="stat-description">
                                Assessment stage
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <div className="stat-icon blue">
                                    <CalendarDays size={19} />
                                </div>

                                <span className="stat-change positive">
                                    <TrendingUp size={13} />
                                    {interviewRate}%
                                </span>

                            </div>

                            <p>Interviews</p>

                            <strong>{interviewCount}</strong>

                            <span className="stat-description">
                                Scheduled interviews
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <div className="stat-icon green">
                                    <CheckCircle2 size={19} />
                                </div>

                                <span className="stat-change positive">
                                    <TrendingUp size={13} />
                                    {offerRate}%
                                </span>

                            </div>

                            <p>Offers</p>

                            <strong>{offerCount}</strong>

                            <span className="stat-description">
                                Offers received
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <div className="stat-icon orange">
                                    <X size={19} />
                                </div>

                                <span className="stat-change rejected-change">
                                    {rejectionRate}%
                                </span>

                            </div>

                            <p>Rejected</p>

                            <strong>{rejectedCount}</strong>

                            <span className="stat-description">
                                Applications rejected
                            </span>

                        </div>

                    </section>


                    {/* Overview */}
                    <section className="dashboard-grid">

                        <div className="dashboard-card overview-card">

                            <div className="card-header">

                                <div>
                                    <h2>Application overview</h2>
                                    <p>
                                        Your application activity
                                    </p>
                                </div>

                                <button className="period-button">
                                    Last 6 months
                                </button>

                            </div>


                            <div className="chart-placeholder">

                                <div className="chart-bars">

                                    {monthlyApplications.map((month) => (
                                        <div
                                            className={`chart-bar ${month === monthlyApplications[monthlyApplications.length - 1]
                                                ? "active"
                                                : ""}`}
                                            key={`${month.year}-${month.month}`}
                                            style={{ height: month.height }}
                                            title={`${month.count} application${month.count === 1 ? "" : "s"} in ${month.label}`}
                                        />
                                    ))}

                                </div>

                                <div className="chart-labels">

                                    {monthlyApplications.map((month) => (
                                        <span key={`${month.year}-${month.month}`}>
                                            {month.label}
                                        </span>
                                    ))}

                                </div>

                            </div>

                        </div>


                        {/* Application status */}
                        <div className="dashboard-card status-card">

                            <div className="card-header">

                                <div>
                                    <h2>Application status</h2>
                                    <p>
                                        Current distribution
                                    </p>
                                </div>

                            </div>


                            <div className="status-list">

                                <div className="status-row total-status-row">

                                    <div className="status-row-main">
                                        <div>
                                            <span className="status-indicator total"></span>
                                            Total applications
                                        </div>

                                        <strong>{totalApplications}</strong>
                                    </div>

                                    <div className="status-progress total-progress">
                                        <span style={{ width: totalApplications ? "100%" : "0%" }} />
                                    </div>

                                </div>


                                <div className="status-row">

                                    <div className="status-row-main">
                                        <div>
                                            <span className="status-indicator assessment"></span>
                                            Online assessment
                                        </div>

                                        <strong>{onlineAssessmentCount}</strong>
                                    </div>

                                    <div className="status-progress assessment-progress">
                                        <span style={{ width: `${assessmentRate}%` }} />
                                    </div>

                                </div>


                                <div className="status-row">

                                    <div className="status-row-main">
                                        <div>
                                            <span className="status-indicator applied"></span>
                                            Applied
                                        </div>

                                        <strong>{appliedCount}</strong>
                                    </div>

                                    <div className="status-progress applied-progress">
                                        <span style={{ width: `${totalApplications ? Math.round((appliedCount / totalApplications) * 100) : 0}%` }} />
                                    </div>

                                </div>


                                <div className="status-row">

                                    <div className="status-row-main">
                                        <div>
                                            <span className="status-indicator interview"></span>
                                            Interview
                                        </div>

                                        <strong>{interviewCount}</strong>
                                    </div>

                                    <div className="status-progress interview-progress">
                                        <span style={{ width: `${interviewRate}%` }} />
                                    </div>

                                </div>


                                <div className="status-row">

                                    <div className="status-row-main">
                                        <div>
                                            <span className="status-indicator offer"></span>
                                            Offer
                                        </div>

                                        <strong>{offerCount}</strong>
                                    </div>

                                    <div className="status-progress offer-progress">
                                        <span style={{ width: `${offerRate}%` }} />
                                    </div>

                                </div>


                                <div className="status-row">

                                    <div className="status-row-main">
                                        <div>
                                            <span className="status-indicator rejected"></span>
                                            Rejected
                                        </div>

                                        <strong>{rejectedCount}</strong>
                                    </div>

                                    <div className="status-progress rejected-progress">
                                        <span style={{ width: `${rejectionRate}%` }} />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Recent applications */}
                    <section className="dashboard-card recent-card">

                        <div className="card-header">

                            <div>
                                <h2>Recent applications</h2>
                                <p>
                                    Your latest job applications
                                </p>
                            </div>

                            <button
                                className="view-all-button"
                                onClick={() => navigate("/applications")}
                            >
                                View all
                            </button>

                        </div>


                        <div className="applications-table">

                            <div className="table-header">
                                <span>Company</span>
                                <span>Position</span>
                                <span>Status</span>
                                <span>Date</span>
                            </div>


                            {applicationsLoading ? (

                                <div className="applications-loading">

                                    <div className="application-skeleton">
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <div className="application-skeleton">
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <div className="application-skeleton">
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                </div>

                            ) : applicationsError ? (

                                <div className="applications-empty">

                                    <div className="empty-icon error-icon">
                                        <X size={20} />
                                    </div>

                                    <strong>
                                        Unable to load applications
                                    </strong>

                                    <p>
                                        {applicationsError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={fetchApplications}
                                    >
                                        Try again
                                    </button>

                                </div>

                            ) : applications.length === 0 ? (

                                <div className="applications-empty">

                                    <div className="empty-icon">
                                        <BriefcaseBusiness size={20} />
                                    </div>

                                    <strong>
                                        No applications yet
                                    </strong>

                                    <p>
                                        Start tracking your job search by adding
                                        your first application.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setShowApplicationModal(true)}
                                    >
                                        Add application
                                    </button>

                                </div>

                            ) : (

                                applications
                                    .slice(0, 5)
                                    .map((application, index) => (

                                        <div
                                            className="application-row"
                                            key={application._id}
                                            style={{
                                                animationDelay: `${index * 70}ms`
                                            }}
                                        >

                                            <div className="company-cell">

                                                <div className="company-logo">
                                                    {application.company
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <span>
                                                    {application.company}
                                                </span>

                                            </div>


                                            <span>
                                                {application.role}
                                            </span>


                                            <span
                                                className={`application-status ${getStatusClass(
                                                    application.status
                                                )}`}
                                            >
                                                {application.status}
                                            </span>


                                            <span>
                                                {formatDate(
                                                    application.appliedDate
                                                )}
                                            </span>

                                        </div>

                                    ))

                            )}

                        </div>

                    </section>

                </main>

            </div>

            {showApplicationModal && (
                <AddApplicationModal
                    onClose={() => setShowApplicationModal(false)}
                    onApplicationAdded={() => {
                        fetchApplications();
                    }}
                />
            )}

        </div>
    );
}

export default Dashboard;