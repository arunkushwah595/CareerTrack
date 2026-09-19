import {
    BriefcaseBusiness,
    CalendarDays,
    ClipboardCheck,
    LayoutDashboard,
    LogOut,
    Moon,
    Settings,
    Sun
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

function AppSidebar({ active }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
            } catch {
                setUser(null);
            }
        };

        loadUser();
    }, []);

    const goTo = (path) => navigate(path);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="dashboard-sidebar shared-app-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <BriefcaseBusiness size={19} />
                    </div>
                    <span>CareerTrack</span>
                </div>
            </div>

            <nav className="sidebar-navigation" aria-label="Main navigation">
                <p className="navigation-label">Overview</p>
                <button className={`navigation-item ${active === "dashboard" ? "active" : ""}`} onClick={() => goTo("/dashboard")}>
                    <LayoutDashboard size={18} /> <span>Dashboard</span>
                </button>
                <button className={`navigation-item ${active === "applications" ? "active" : ""}`} onClick={() => goTo("/applications")}>
                    <BriefcaseBusiness size={18} /> <span>Applications</span>
                </button>
                <button className={`navigation-item ${active === "assessments" ? "active" : ""}`} onClick={() => goTo("/online-assessments")}>
                    <ClipboardCheck size={18} /> <span>Online assessments</span>
                </button>
                <button className={`navigation-item ${active === "interviews" ? "active" : ""}`} onClick={() => goTo("/interviews")}>
                    <CalendarDays size={18} /> <span>Interviews</span>
                </button>
                <p className="navigation-label navigation-label-spaced">Account</p>
                <button className={`navigation-item ${active === "settings" ? "active" : ""}`} onClick={() => goTo("/settings")}>
                    <Settings size={18} /> <span>Settings</span>
                </button>
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-account">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="profile-info">
                        <strong>{user?.name || "Loading..."}</strong>
                    </div>
                    <button className="header-theme-button sidebar-theme-button" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18} /> <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default AppSidebar;
