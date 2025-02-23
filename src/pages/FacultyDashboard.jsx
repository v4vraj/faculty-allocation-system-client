import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid2,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [allocations, setAllocations] = useState([]);
  const [facultyDetails, setFacultyDetails] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/users/getAllocationByFaculty/${user.id}`
        );
        setAllocations(res.data);
      } catch (error) {
        console.error("Error fetching allocations:", error);
      }
    };
    const facultyDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/getFacultyById/${user.id}`
        );
        console.log(response.data[0].hours_completed);
        setFacultyDetails(response.data);
      } catch (error) {
        console.error("Error fetching faculty details");
      }
    };
    fetchAllocations();
    facultyDetails();
  }, [user.id]);

  // Pie chart data (Allocated Courses)
  const allocatedCoursesData = allocations.map((course, index) => ({
    id: index,
    value: course.course_hours,
    label: course.course_name,
  }));

  const allocated_hours =
    facultyDetails.length > 0 ? facultyDetails[0].allocated_hours : 0;
  const completed_hours =
    facultyDetails.length > 0 ? facultyDetails[0].hours_completed : 0;

  return (
    <Grid2 container spacing={3} sx={{ p: 4 }}>
      {/* Table for Allocated Courses */}

      {/* Allocated Courses Pie Chart */}
      <Grid2 item xs={12} md={6} size={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Allocated Courses Distribution
            </Typography>
            <PieChart
              series={[
                {
                  data: allocatedCoursesData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  labelStyle: { fontSize: 10 },
                  innerRadius: 50,
                  labelPosition: "outside",
                  outerRadius: 90,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
              ]}
              width={500}
              height={300}
            />
          </CardContent>
        </Card>
      </Grid2>

      {/* Allocated Hours vs Completed Hours Bar Chart */}
      <Grid2 item xs={12} md={6} size={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Allocated Hours vs Completed Hours
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Allocated", "Completed"] }]}
              series={[
                {
                  data: [allocated_hours, completed_hours],
                  label: "Hours",
                  color: "#82ca9d",
                },
              ]}
              width={500}
              height={300}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} size={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Allocated Courses
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Course Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Course Code</b>
                    </TableCell>
                    <TableCell>
                      <b>Hours</b>
                    </TableCell>
                    <TableCell>
                      <b>Term</b>
                    </TableCell>
                    <TableCell>
                      <b>Program</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocations.map((course) => (
                    <TableRow key={course.allocation_id}>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>{course.course_code}</TableCell>
                      <TableCell>{course.course_hours}</TableCell>
                      <TableCell>{course.term_number}</TableCell>
                      <TableCell>{course.program_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default FacultyDashboard;
