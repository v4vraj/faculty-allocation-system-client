import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import NAVIGATION from "./Navigation"; // Default import
import useDemoRouter from "./useDemoRouter";
import { extendTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom"; // This allows dynamic content rendering

// Theme setup (unchanged)
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
  const { user } = useContext(AuthContext);

  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;

  // Conditionally set navigation based on user role
  const navigation =
    user.role === "Admin" ? NAVIGATION.admin : NAVIGATION.faculty;

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
    >
      <ToolpadDashboardLayout>
        <PageContainer>
          {/* This will render the child routes dynamically */}
          <Outlet />
        </PageContainer>
      </ToolpadDashboardLayout>
    </AppProvider>
  );
};

export default DashboardLayoutBasic;
