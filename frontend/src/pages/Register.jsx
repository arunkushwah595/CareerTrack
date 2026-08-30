import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import ThemeToggle from "../components/ThemeToggle";

import "./Register.css";


function Register() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    const validateForm = () => {

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            return "Please fill in all fields.";
        }


        if (formData.name.trim().length < 2) {
            return "Name must contain at least 2 characters.";
        }


        if (formData.password.length < 6) {
            return "Password must be at least 6 characters.";
        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {
            return "Passwords do not match.";
        }


        return "";
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }


        try {

            setLoading(true);
            setError("");
            setSuccess("");


            const response = await api.post(
                "/auth/register",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            );


            setSuccess(
                response.data?.message ||
                "Account created successfully."
            );


            /*
             * Registration endpoint currently returns
             * the user but does not return a JWT.
             *
             * Therefore we redirect to login rather
             * than pretending the user is authenticated.
             */

            setTimeout(() => {
                navigate("/login");
            }, 900);


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <main className="register-page">


            {/* =================================================
                LEFT VISUAL SECTION
            ================================================= */}

            <section className="register-visual">

                <div className="register-visual-gradient"></div>


                <div className="register-visual-content">

                    <div className="register-brand">

                        <div className="register-brand-icon">
                            <BriefcaseBusiness size={22} />
                        </div>

                        <span>
                            CareerTrack
                        </span>

                    </div>


                    <div className="register-visual-text">

                        <span className="register-eyebrow">
                            START YOUR JOURNEY
                        </span>

                        <h1>
                            Organize your job search.
                            <span>
                                {" "}Build your career.
                            </span>
                        </h1>

                        <p>
                            Track applications, manage interviews,
                            and keep every opportunity organized
                            from one professional workspace.
                        </p>

                    </div>


                    <div className="register-benefits">

                        <div className="register-benefit">

                            <div className="register-benefit-icon">
                                <CheckCircle2 size={16} />
                            </div>

                            <div>
                                <strong>
                                    One place for every application
                                </strong>

                                <span>
                                    Keep your entire job search organized.
                                </span>
                            </div>

                        </div>


                        <div className="register-benefit">

                            <div className="register-benefit-icon">
                                <CheckCircle2 size={16} />
                            </div>

                            <div>
                                <strong>
                                    Track your progress
                                </strong>

                                <span>
                                    See where every application stands.
                                </span>
                            </div>

                        </div>


                        <div className="register-benefit">

                            <div className="register-benefit-icon">
                                <CheckCircle2 size={16} />
                            </div>

                            <div>
                                <strong>
                                    Stay focused
                                </strong>

                                <span>
                                    Spend less time managing and more time preparing.
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                REGISTER FORM
            ================================================= */}

            <section className="register-section">


                <div className="register-theme-control">
                    <ThemeToggle />
                </div>


                <div className="register-container">


                    <div className="register-mobile-brand">

                        <div className="register-brand-icon">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span>
                            CareerTrack
                        </span>

                    </div>


                    <div className="register-header">

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Start organizing your career opportunities today.
                        </p>

                    </div>


                    {error && (

                        <div
                            className="register-message register-error"
                            role="alert"
                        >
                            {error}
                        </div>

                    )}


                    {success && (

                        <div
                            className="register-message register-success"
                            role="status"
                        >
                            <CheckCircle2 size={15} />

                            <span>
                                {success}
                            </span>
                        </div>

                    )}


                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >


                        {/* NAME */}

                        <div className="register-form-group">

                            <label htmlFor="name">
                                Full name
                            </label>

                            <div className="register-input-wrapper">

                                <User size={17} />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="register-form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="register-input-wrapper">

                                <Mail size={17} />

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


                        {/* PASSWORD */}

                        <div className="register-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="register-input-wrapper">

                                <Lock size={17} />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="register-form-group">

                            <label htmlFor="confirmPassword">
                                Confirm password
                            </label>

                            <div className="register-input-wrapper">

                                <Lock size={17} />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Re-enter your password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            className="register-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="register-spinner"></span>

                                    Creating account...
                                </>

                            ) : (

                                <>
                                    Create account

                                    <ArrowRight size={17} />
                                </>

                            )}

                        </button>

                    </form>


                    <div className="register-footer">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>


                </div>

            </section>

        </main>
    );
}


export default Register;