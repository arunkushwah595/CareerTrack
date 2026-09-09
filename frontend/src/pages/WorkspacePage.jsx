import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    LayoutDashboard,
    LogOut,
    Settings,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import "./WorkspacePage.css";
import MobileAppHeader from "../components/MobileAppHeader";
import AppSidebar from "../components/AppSidebar";

const pageConfig = {
    interviews: {
        title: "Interviews",
        description: "Keep upcoming conversations and interview stages in view.",
        icon: CalendarDays
    },
    "online-assessments": {
        title: "Online assessments",
        description: "Track applications that need an online assessment.",
        icon: ClipboardCheck
    },
    settings: {
        title: "Settings",
        description: "Control the preferences for your CareerTrack workspace.",
        icon: Settings
    }
};

function WorkspacePage() {
    const { section } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const config = pageConfig[section] || pageConfig.settings;
    const PageIcon = config.icon;
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const loadWorkspaceData = async () => {
            try {
                setLoading(true);
                const requests = [api.get("/auth/me")];

                if (section === "interviews" || section === "online-assessments") {
                    requests.push(api.get("/applications"));
                }

                const responses = await Promise.all(requests);
                setUser(responses[0].data.user);
                setApplications(responses[1]?.data || []);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load this workspace section."
                );
            } finally {
                setLoading(false);
            }
        };

        loadWorkspaceData();
    }, [section]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const interviews = applications.filter(
        (application) => application.status === "Interview"
    );

    const onlineAssessments = applications.filter(
        (application) => application.status === "Online Assessment"
    );

    const navigateTo = (path) => {
        setSidebarOpen(false);
        navigate(path);
    };

    return (
        <div className="workspace-layout">
            {sidebarOpen && (
                <button
                    className="workspace-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <AppSidebar active={section === "online-assessments" ? "assessments" : section} />
            <aside className={`workspace-sidebar ${sidebarOpen ? "workspace-sidebar-open" : ""}`}>
                <button className="workspace-brand" onClick={() => navigateTo("/dashboard")}>
                    <span className="workspace-brand-icon"><BriefcaseBusiness size={18} /></span>
                    CareerTrack
                </button>

                <nav className="workspace-navigation" aria-label="Main navigation">
                    <span className="workspace-label">Overview</span>
                    <button className="workspace-nav-item" onClick={() => navigateTo("/dashboard")}>
                        <LayoutDashboard size={17} /> Dashboard
                    </button>
                    <button className="workspace-nav-item" onClick={() => navigateTo("/applications")}>
                        <BriefcaseBusiness size={17} /> Applications
                    </button>
                    <button className={`workspace-nav-item ${section === "online-assessments" ? "active" : ""}`} onClick={() => navigateTo("/online-assessments")}>
                        <ClipboardCheck size={17} /> Online assessments
                    </button>
                    <button className={`workspace-nav-item ${section === "interviews" ? "active" : ""}`} onClick={() => navigateTo("/interviews")}>
                        <CalendarDays size={17} /> Interviews
                    </button>
                    <span className="workspace-label workspace-label-spaced">Account</span>
                    <button className={`workspace-nav-item ${section === "settings" ? "active" : ""}`} onClick={() => navigateTo("/settings")}>
                        <Settings size={17} /> Settings
                    </button>
                </nav>

                <button className="workspace-logout" onClick={handleLogout}>
                    <LogOut size={17} /> Logout
                </button>
            </aside>

            <main className="workspace-main">
                <MobileAppHeader />

                <div className="workspace-content">
                    <div className="workspace-heading">
                        <div className="workspace-heading-icon"><PageIcon size={22} /></div>
                        <div>
                            <p className="workspace-eyebrow">Career workspace</p>
                            <h1>{config.title}</h1>
                            <p>{config.description}</p>
                        </div>
                    </div>

                    {error ? (
                        <section className="workspace-panel workspace-empty">
                            <X size={22} />
                            <h2>Unable to load this section</h2>
                            <p>{error}</p>
                        </section>
                    ) : loading ? (
                        <section className="workspace-panel workspace-empty">
                            <div className="workspace-loader" />
                            <p>Loading workspace data...</p>
                        </section>
                    ) : section === "interviews" || section === "online-assessments" ? (
                        <section className="workspace-panel">
                            <div className="workspace-panel-heading">
                                <div>
                                    <h2>{section === "interviews" ? "Interview pipeline" : "Assessment pipeline"}</h2>
                                    <p>{section === "interviews" ? interviews.length : onlineAssessments.length} {section === "interviews" ? "interview-stage applications" : "assessment-stage applications"}</p>
                                </div>
                                {section === "interviews" ? <CalendarDays size={20} /> : <ClipboardCheck size={20} />}
                            </div>
                            {(section === "interviews" ? interviews : onlineAssessments).length === 0 ? (
                                <div className="workspace-empty workspace-empty-inline">
                                    <CheckCircle2 size={22} />
                                    <h3>{section === "interviews" ? "No interviews scheduled" : "No online assessments"}</h3>
                                    <p>{section === "interviews" ? "Applications marked as Interview will appear here." : "Applications marked as Online Assessment will appear here."}</p>
                                </div>
                            ) : (
                                <div className="workspace-list">
                                    {(section === "interviews" ? interviews : onlineAssessments).map((application) => (
                                        <div className="workspace-list-row" key={application._id}>
                                            <div>
                                                <strong>{application.company}</strong>
                                                <span>{application.role}</span>
                                            </div>
                                            <span className="workspace-status">{application.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className="workspace-panel">
                            <div className="workspace-panel-heading">
                                <div>
                                    <h2>Workspace preferences</h2>
                                    <p>Choose how CareerTrack should look and behave.</p>
                                </div>
                                <Settings size={20} />
                            </div>
                            <div className="workspace-setting-row">
                                <div>
                                    <strong>Appearance</strong>
                                    <span>Use the {theme} theme across the workspace.</span>
                                </div>
                                <button className="workspace-save-button" onClick={toggleTheme}>
                                    {theme === "dark" ? "Use light theme" : "Use dark theme"}
                                </button>
                            </div>
                            <div className="workspace-setting-row">
                                <div>
                                    <strong>Account status</strong>
                                    <span>{user?.email || "Signed-in account"}</span>
                                </div>
                                <button className="workspace-save-button" onClick={() => setSaved(true)}>
                                    {saved ? "Saved" : "Save preference"}
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

export default WorkspacePage;
