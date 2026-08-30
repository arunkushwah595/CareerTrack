import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    BriefcaseBusiness
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Login.css";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/auth/login",
                formData
            );

            const { token } = response.data;

            login(token);

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            <section className="login-visual">

                <div className="visual-gradient"></div>

                <div className="visual-content">

                    <div className="brand">
                        <div className="brand-icon">
                            <BriefcaseBusiness size={22} />
                        </div>

                        <span>CareerTrack</span>
                    </div>

                    <div className="visual-text">
                        <h1>
                            Build your career.
                            <span> Track every opportunity.</span>
                        </h1>

                        <p>
                            Keep your job applications organized,
                            monitor your progress, and stay focused
                            on your next opportunity.
                        </p>
                    </div>

                    <div className="visual-card">

                        <div className="visual-card-header">
                            <span>Application Overview</span>

                            <span className="status-dot">
                                Live
                            </span>
                        </div>

                        <div className="visual-stats">

                            <div>
                                <strong>24</strong>
                                <span>Applications</span>
                            </div>

                            <div>
                                <strong>08</strong>
                                <span>Interviews</span>
                            </div>

                            <div>
                                <strong>03</strong>
                                <span>Offers</span>
                            </div>

                        </div>

                    </div>

                </div>
            </section>


            <section className="login-section">

                <div className="theme-control">
                    <ThemeToggle />
                </div>

                <div className="login-container">

                    <div className="mobile-brand">

                        <div className="brand-icon">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span>CareerTrack</span>

                    </div>

                    <div className="login-header">

                        <h2>Welcome back</h2>

                        <p>
                            Sign in to continue to your career dashboard.
                        </p>

                    </div>


                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <Mail size={18} />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <div className="input-wrapper">

                                <Lock size={18} />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>


                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={18} />
                                </>
                            )}

                        </button>

                    </form>


                    <div className="login-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Login;