import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <button
            className={`theme-toggle ${isDark ? "dark" : ""}`}
            onClick={toggleTheme}
            type="button"
            aria-label={
                isDark
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            }
        >
            <span className="theme-toggle-slider">
                {isDark ? (
                    <Moon size={16} />
                ) : (
                    <Sun size={16} />
                )}
            </span>
        </button>
    );
}

export default ThemeToggle;