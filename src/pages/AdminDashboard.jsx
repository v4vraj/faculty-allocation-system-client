import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

const AdminDashboard = () => {
  const [faculty, setFaculty] = useState([]); // State to store faculty data
  const [programs, setPrograms] = useState([]); // State to store programs data
  const [facultyStats, setFacultyStats] = useState([]); // State to store faculty statistics
  const [programStats, setProgramStats] = useState([]); // State to store program statistics

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get("/api/users/getAllFaculty");
        setFaculty(res.data);

        // Aggregate faculty count
        const roleData = { Faculty: 0 };

        res.data.forEach((user) => {
          roleData[user.role] = (roleData[user.role] || 0) + 1;
        });

        setFacultyStats(
          Object.entries(roleData).map(([role, count]) => ({ role, count }))
        );
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    const fetchPrograms = async () => {
      try {
        const res = await axios.get("/api/programs/getAllPrograms");
        setPrograms(res.data);

        // Aggregate programs data (count programs per year, or any other metric)
        const yearData = {};

        res.data.forEach((program) => {
          const year = program.start_year; // You can use start_year or other properties for aggregation
          yearData[year] = (yearData[year] || 0) + 1;
        });

        setProgramStats(
          Object.entries(yearData).map(([year, count]) => ({ year, count }))
        );
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchFaculty();
    fetchPrograms();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Charts Section */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Bar Chart - Faculty Count */}
        <Card sx={{ flex: 1, padding: 2 }}>
          <CardContent>
            <Typography variant="h6">Faculty Count</Typography>
            <BarChart
              dataset={facultyStats}
              xAxis={[{ scaleType: "band", dataKey: "role" }]}
              series={[{ dataKey: "count", label: "Faculty Count" }]}
              width={400}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Bar Chart - Programs Count by Year */}
        <Card sx={{ flex: 1, padding: 2 }}>
          <CardContent>
            <Typography variant="h6">Programs Count by Year</Typography>
            <BarChart
              dataset={programStats}
              xAxis={[{ scaleType: "band", dataKey: "year" }]}
              series={[{ dataKey: "count", label: "Programs Count" }]}
              width={400}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Faculty List Table */}
      <Card sx={{ padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Faculty Members
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faculty.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Programs List Table */}
      <Card sx={{ padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Programs
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Program ID</TableCell>
                <TableCell>Program Name</TableCell>
                <TableCell>Start Year</TableCell>
                <TableCell>End Year</TableCell>
                <TableCell>Total Terms</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.program_id}>
                  <TableCell>{program.program_id}</TableCell>
                  <TableCell>{program.program_name}</TableCell>
                  <TableCell>{program.start_year}</TableCell>
                  <TableCell>{program.end_year}</TableCell>
                  <TableCell>{program.total_terms}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
