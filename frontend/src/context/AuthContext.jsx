import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => {
        return localStorage.getItem("careertrack-token");
    });

    const login = (newToken) => {
        localStorage.setItem(
            "careertrack-token",
            newToken
        );

        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem(
            "careertrack-token"
        );

        setToken(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};