import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    TrendingUp,
    UserRound,
    X
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import "./Dashboard.css";
import AddApplicationModal from "../components/AddApplicationModal";

function Dashboard() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState("");

    const fetchApplications = async () => {
        try {
            setApplicationsLoading(true);
            setApplicationsError("");

            const response = await api.get("/applications");

            setApplications(response.data.applications || []);

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
        fetchApplications();
    }, []);

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showApplicationModal, setShowApplicationModal] =
        useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };



    const totalApplications = applications.length;

    const interviewCount = applications.filter(
        (application) =>
            application.status === "Interview"
    ).length;

    const offerCount = applications.filter(
        (application) =>
            application.status === "Selected"
    ).length;

    const rejectedCount = applications.filter(
        (application) =>
            application.status === "Rejected"
    ).length;

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

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""
                    }`}
            >

                <div className="sidebar-header">

                    <div className="sidebar-brand">

                        <div className="sidebar-brand-icon">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span>CareerTrack</span>

                    </div>

                    <button
                        className="mobile-close-button"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>

                </div>


                <nav className="sidebar-navigation">

                    <p className="navigation-label">
                        Overview
                    </p>

                    <button className="navigation-item active">

                        <LayoutDashboard size={18} />

                        <span>Dashboard</span>

                    </button>


                    <button className="navigation-item">

                        <BriefcaseBusiness size={18} />

                        <span>Applications</span>

                    </button>


                    <button className="navigation-item">

                        <CalendarDays size={18} />

                        <span>Interviews</span>

                    </button>


                    <p className="navigation-label navigation-label-spaced">
                        Account
                    </p>


                    <button className="navigation-item">

                        <UserRound size={18} />

                        <span>Profile</span>

                    </button>


                    <button className="navigation-item">

                        <Settings size={18} />

                        <span>Settings</span>

                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>


            {/* Main */}
            <div className="dashboard-main">

                {/* Header */}
                <header className="dashboard-header">

                    <button
                        className="mobile-menu-button"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={21} />
                    </button>


                    <div className="header-spacer"></div>


                    <button
                        className="header-theme-button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>


                    <div className="header-profile">

                        <div className="profile-avatar">
                            A
                        </div>

                        <div className="profile-info">
                            <strong>Arun</strong>
                            <span>Candidate</span>
                        </div>

                    </div>

                </header>


                {/* Content */}
                <main className="dashboard-content">

                    <section className="welcome-section">

                        <div>
                            <p className="welcome-label">
                                Career overview
                            </p>

                            <h1>
                                Good afternoon, Arun
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
                                    12%
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

                                <div className="stat-icon blue">
                                    <CalendarDays size={19} />
                                </div>

                                <span className="stat-change positive">
                                    <TrendingUp size={13} />
                                    8%
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
                                    4%
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

                                <span className="stat-change neutral">
                                    —
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

                                    <div
                                        className="chart-bar"
                                        style={{ height: "35%" }}
                                    />

                                    <div
                                        className="chart-bar"
                                        style={{ height: "52%" }}
                                    />

                                    <div
                                        className="chart-bar"
                                        style={{ height: "43%" }}
                                    />

                                    <div
                                        className="chart-bar"
                                        style={{ height: "68%" }}
                                    />

                                    <div
                                        className="chart-bar"
                                        style={{ height: "58%" }}
                                    />

                                    <div
                                        className="chart-bar active"
                                        style={{ height: "82%" }}
                                    />

                                </div>

                                <div className="chart-labels">

                                    <span>Mar</span>
                                    <span>Apr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                    <span>Aug</span>

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

                                <div className="status-row">

                                    <div>
                                        <span className="status-indicator applied"></span>
                                        Applied
                                    </div>

                                    <strong>{totalApplications}</strong>

                                </div>


                                <div className="status-row">

                                    <div>
                                        <span className="status-indicator interview"></span>
                                        Interview
                                    </div>

                                    <strong>6</strong>

                                </div>


                                <div className="status-row">

                                    <div>
                                        <span className="status-indicator offer"></span>
                                        Offer
                                    </div>

                                    <strong>3</strong>

                                </div>


                                <div className="status-row">

                                    <div>
                                        <span className="status-indicator rejected"></span>
                                        Rejected
                                    </div>

                                    <strong>5</strong>

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

                            <button className="view-all-button">
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