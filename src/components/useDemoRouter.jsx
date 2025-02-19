import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Ensure you have this context imported

function useDemoRouter() {
  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  const router = useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        // Conditionally navigate based on user role
        const basePath = user?.role === "Admin" ? "/admin" : "/faculty";
        navigate(`${basePath}${path}`);
      },
    }),
    [location, navigate, user] // Adding `user` as a dependency
  );

  return router;
}

export default useDemoRouter;
