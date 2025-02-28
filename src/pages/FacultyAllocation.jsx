import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  Grid2,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import InfoModal from "../components/InfoModal";

const FacultyAllocation = () => {
  const [yearList, setYearList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [programList, setProgramList] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [allocationList, setAllocationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [OpenSuccessModal, setOpenSuccessModal] = useState(false);

  const fetchYears = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/programs/getAllYears`
      );
      setYearList(res.data);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };
  const fetchAllAllocation = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/getAllAllocation`
      );
      console.log(response.data);

      setAllocationList(response.data);
    } catch (error) {
      console.error("Error fetching allocations", error);
    }
  };
  useEffect(() => {
    fetchYears();
    fetchAllAllocation();
  }, []);

  const handleYearChange = async (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setSelectedProgram("");
    setSelectedFaculty("");
    setSelectedCourse("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/programs/getProgramsByYear/${year}`
      );
      setProgramList(res.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleProgramChange = async (e) => {
    const program = e.target.value;
    setSelectedProgram(program);
    setSelectedFaculty("");
    setSelectedCourse("");
    try {
      const facultyRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/getAllFaculty`
      );
      setFacultyList(facultyRes.data);
      const courseRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses/getNonAllocatedCourses`
      );
      setCourseList(courseRes.data);
    } catch (error) {
      console.error("Error fetching faculty and courses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/allocateFaculty`,
        {
          year: selectedYear,
          program_id: selectedProgram,
          faculty_id: selectedFaculty,
          course_id: selectedCourse,
        }
      );
      setSuccessMsg(res.data.message);
      setOpenSuccessModal(true);
      fetchAllAllocation();
    } catch (error) {
      console.error("Error allocating faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid2 container spacing={3} sx={{ p: 4 }}>
      <Grid2 item xs={12} md={6} size={6}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Faculty Allocation
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <FormControl fullWidth>
                <InputLabel>Select Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={handleYearChange}
                  required
                >
                  {yearList.map((year) => (
                    <MenuItem key={year.year_range} value={year.year_range}>
                      {year.year_range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!selectedYear}>
                <InputLabel>Select Program</InputLabel>
                <Select
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  required
                >
                  {programList.map((program) => (
                    <MenuItem
                      key={program.program_id}
                      value={program.program_id}
                    >
                      {program.program_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!selectedProgram}>
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  {courseList.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.course_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!selectedProgram}>
                <InputLabel>Select Faculty</InputLabel>
                <Select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  required
                >
                  {facultyList.map((faculty) => (
                    <MenuItem key={faculty.id} value={faculty.id}>
                      {faculty.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Allocate Faculty"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={6} size={6}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <h1>Allocation Details</h1>
            <p>
              <strong>Program Name:</strong>{" "}
              {programList.find(
                (program) => program.program_id === selectedProgram
              )?.program_name || "Not selected"}
            </p>
            <p>
              <strong>Course Name:</strong>{" "}
              {courseList.find((course) => course.id === selectedCourse)
                ?.course_name || "Not Selected"}
            </p>
            <p>
              <strong>Faulty Name:</strong>{" "}
              {facultyList.find((faculty) => faculty.id === selectedFaculty)
                ?.email || "Not Selected"}
            </p>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={6} size={12}>
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Courses
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Faculty Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allocationList.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell>{allocation.program_name}</TableCell>
                    <TableCell>{allocation.course_name}</TableCell>
                    <TableCell>{allocation.faculty_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid2>
      <InfoModal
        open={OpenSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        title="Success!!"
        onConfirm={() => setOpenSuccessModal(false)}
        message={`Faculty allocated to the course successfully!`}
        error={successMsg}
        type="success"
      ></InfoModal>
    </Grid2>
  );
};

export default FacultyAllocation;
