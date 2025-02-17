import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
      }}
    >
      {loading ? <div>Loading...</div> : children}{" "}
      {/* Show loading during auth check */}
    </AuthContext.Provider>
  );
};
