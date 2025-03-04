import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import DashboardLayoutBasic from "./components/DashboardLayout";
import CourseCreation from "./pages/CourseCreation";
import FacultyAllocation from "./pages/FacultyAllocation";
import BulkUpload from "./pages/BulkUpload";
import CreateFaculty from "./pages/CreateFaculty";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <Routes>
                <Route path="/" element={<DashboardLayoutBasic />}>
                  {/* Admin Routes */}
                  <Route
                    path="admin/dashboard"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                        element={<AdminDashboard />}
                      />
                    }
                  />
                  <Route
                    path="admin/course-creation"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                        element={<CourseCreation />}
                      />
                    }
                  />
                  <Route
                    path="admin/allocate-faculty"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                        element={<FacultyAllocation />}
                      />
                    }
                  />
                  <Route
                    path="admin/bulk-uploads"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                        element={<BulkUpload />}
                      />
                    }
                  />
                  <Route
                    path="admin/create-faculty"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                        element={<CreateFaculty />}
                      />
                    }
                  />
                  {/* Faculty Routes */}
                  <Route
                    path="faculty/dashboard"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Faculty"]}
                        element={<FacultyDashboard />}
                      />
                    }
                  />
                </Route>
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
