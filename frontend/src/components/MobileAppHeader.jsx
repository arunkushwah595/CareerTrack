import {
    BriefcaseBusiness,
    CalendarDays,
    ClipboardCheck,
    LayoutDashboard,
    LogOut,
    MoreHorizontal,
    Moon,
    Settings,
    Sun
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import "./MobileAppHeader.css";

function MobileAppHeader() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

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

    const goTo = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/login");
    };

    return (
        <header className="mobile-app-header">
            <button
                className="mobile-app-brand"
                onClick={() => goTo("/dashboard")}
                type="button"
            >
                <span className="mobile-app-brand-icon">
                    <BriefcaseBusiness size={18} />
                </span>
                <span>CareerTrack</span>
            </button>

            <div className="mobile-app-actions">
                <button
                    className="mobile-app-icon-button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    type="button"
                >
                    {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>

                <div className="mobile-app-menu-wrap">
                    <button
                        className="mobile-app-profile-trigger"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Open navigation menu"
                        aria-expanded={menuOpen}
                        type="button"
                    >
                        <span className="mobile-app-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                        <MoreHorizontal size={17} />
                    </button>

                    {menuOpen && (
                        <nav className="mobile-app-menu" aria-label="Workspace navigation">
                            <button onClick={() => goTo("/dashboard")} type="button">
                                <LayoutDashboard size={15} /> Dashboard
                            </button>
                            <button onClick={() => goTo("/applications")} type="button">
                                <BriefcaseBusiness size={15} /> Applications
                            </button>
                            <button onClick={() => goTo("/online-assessments")} type="button">
                                <ClipboardCheck size={15} /> Assessments
                            </button>
                            <button onClick={() => goTo("/interviews")} type="button">
                                <CalendarDays size={15} /> Interviews
                            </button>
                            <button onClick={() => goTo("/settings")} type="button">
                                <Settings size={15} /> Settings
                            </button>
                            <button className="mobile-app-logout" onClick={handleLogout} type="button">
                                <LogOut size={15} /> Logout
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}

export default MobileAppHeader;
