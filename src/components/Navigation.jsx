import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import DescriptionIcon from "@mui/icons-material/Description";

const NAVIGATION = {
  admin: [
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
      route: "/admin/dashboard",
      roles: ["Admin"],
    },
    {
      segment: "course-creation",
      title: "Course Creation",
      icon: <LayersIcon />,
      route: "/admin/course-creation",
      roles: ["Admin"],
    },
    {
      segment: "faculty-allocation",
      title: "Faculty Allocation",
      icon: <DescriptionIcon />,
      route: "/admin/allocate-faculty",
      roles: ["Admin"],
    },
  ],
  faculty: [
    {
      segment: "faculty-dashboard",
      title: "Faculty Dashboard",
      icon: <DashboardIcon />,
      route: "/faculty/dashboard",
      roles: ["Faculty"],
    },
  ],
};

export default NAVIGATION; // Default export
