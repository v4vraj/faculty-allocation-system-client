import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import NAVIGATION from "./Navigation";
import useDemoRouter from "./useDemoRouter";
import { extendTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import axios from "axios";

// Theme setup
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const DashboardLayoutBasic = ({ window }) => {
  const { user, login, logout, loading } = useContext(AuthContext);
  const [session, setSession] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // 🔹 Default to null

  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;

  useEffect(() => {
    const getUserById = async () => {
      if (!user?.id) return; // ✅ Ensure user ID is available before making request

      try {
        const res = await axios.get(`/api/users/getUserById/${user.id}`);
        const userData =
          Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : {};
        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserById();
  }, [user?.id]);

  useEffect(() => {
    if (!loading && userDetails) {
      setSession({
        user: {
          name: userDetails.first_name, // 🔹 Use userDetails name if available
          email: userDetails.email,
          image: userDetails.profilePic || "",
        },
      });
    }
  }, [user, userDetails, loading]);

  const authentication = useMemo(
    () => ({
      signIn: login,
      signOut: logout,
    }),
    [login, logout]
  );

  // 🔹 Use userDetails?.role instead of user?.role
  const navigation =
    userDetails?.role === "Admin" ? NAVIGATION.admin : NAVIGATION.faculty;

  if (loading || !userDetails) return <div>Loading...</div>; // ✅ Ensure data is ready before rendering

  return (
    <AppProvider
      navigation={navigation}
      branding={{
        title: "Faculty-Course Allocation",
        homeUrl: "/",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      session={session}
    >
      <ToolpadDashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ToolpadDashboardLayout>
    </AppProvider>
  );
};

export default DashboardLayoutBasic;
