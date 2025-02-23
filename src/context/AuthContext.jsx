import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null for loading state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Keeps track of loading state
  const navigate = useNavigate();

  // Flag to track if auth check has been performed
  const [authCheckDone, setAuthCheckDone] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/session", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login"); // Redirect to login on failure
      } finally {
        setLoading(false); // End loading after checking
        setAuthCheckDone(true); // Mark auth check as done
      }
    };

    if (!authCheckDone) {
      checkAuth(); // Call checkAuth only if it hasn't been done yet
    }
  }, [navigate, authCheckDone]); // Add authCheckDone as a dependency

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {loading ? (
        <div>
          <Loader message="Loading..." />
        </div>
      ) : (
        children
      )}{" "}
      {/* Show loading during auth check */}
    </AuthContext.Provider>
  );
};
