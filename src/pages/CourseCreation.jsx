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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CardContent,
  Box,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../components/CustomModal";
import InfoModal from "../components/InfoModal";
const CourseCreation = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseHours, setCourseHours] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [totalTerms, setTotalTerms] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [openEditCourseModal, setOpenEditCourseModal] = useState(false);
  const [openDeleteCourseModal, setOpenDeleteCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses/getAllCourses`
      );
      setCourseList(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/programs/getAllPrograms`
        );
        setProgramList(res.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchCourses();
    fetchPrograms();
  }, []);

  const handleProgramChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProgram(selectedId);
    const program = programList.find((p) => p.program_id === selectedId);
    setTotalTerms(program ? program.total_terms : 0);
    setSelectedTerm(""); // Reset term selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses/createCourse`,
        {
          course_name: courseName,
          course_code: courseCode,
          course_hours: courseHours,
          term: selectedTerm,
          program_id: selectedProgram,
        }
      );
      setCourseName("");
      setCourseCode("");
      setCourseHours("");
      setSelectedProgram("");
      setTotalTerms(0);
      setSelectedTerm("");
      const response = await axios.get(
        `{import.meta.env.VITE_API_BASE_URL}/api/courses/getAllCourses`
      );
      setCourseList(response.data);
    } catch (error) {
      setError("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseEdit = (courseData) => {
    setSelectedCourse(courseData);
    const program = programList.find(
      (p) => p.program_id === courseData.program_id
    );
    setTotalTerms(program ? program.total_terms : 0);
    setOpenEditCourseModal(true);
  };

  const handleCourseUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses/updateCourseById/${selectedCourse.id}`,
        selectedCourse
      );
      setOpenEditCourseModal(false);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleCourseDelete = (courseData) => {
    setCourseToDelete(courseData);
    setOpenDeleteCourseModal(true);
  };

  const confirmDeleteCourse = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses/deleteCourseById/${courseToDelete.id}`
      );
      setOpenDeleteCourseModal(false);
      fetchCourses();
    } catch (error) {
      if (error.code === "ERR_BAD_RESPONSE") {
        setDeleteError(
          "This course cannot be deleted because it is associated with one or more allocations."
        );
      } else {
        setDeleteError("Failed to delete the course. Please try again.");
      }
      console.error("Error deleting course:", error);
    }
  };

  return (
    <Grid2 container spacing={3} sx={{ p: 4 }}>
      <Grid2 item xs={12} md={6} size={6}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                label="Course Name"
                variant="outlined"
                fullWidth
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
              <TextField
                label="Course Code"
                variant="outlined"
                fullWidth
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
              <FormControl fullWidth>
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
                      {program.program_code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Select Term</InputLabel>
                <Select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  required
                  disabled={!totalTerms}
                >
                  {[...Array(totalTerms)].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Course Hours"
                variant="outlined"
                type="number"
                fullWidth
                value={courseHours}
                onChange={(e) => setCourseHours(e.target.value)}
                required
              />
              {error && <div style={{ color: "red" }}>{error}</div>}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid2>

      <Grid2 item xs={12} md={6} size={6}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <h1>Course Details</h1>
            <p>
              <strong>Course Name:</strong>{" "}
              {courseName ? courseName : "Not Selected"}
            </p>
            <p>
              <strong>Course Code:</strong>{" "}
              {courseCode ? courseCode : "Not Selected"}
            </p>
            <p>
              <strong>Program Name:</strong>{" "}
              {programList.find(
                (program) => program.program_id === selectedProgram
              )?.program_name || "Not selected"}
            </p>

            <p>
              <strong>Term:</strong>{" "}
              {selectedTerm ? selectedTerm : "Not Selected"}
            </p>
            <p>
              <strong>Course Hours:</strong>{" "}
              {courseHours ? courseHours : "Not Selected"}
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
                  <TableCell>Course Name</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Hours</TableCell>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Term Number</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseList.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.course_code}</TableCell>
                    <TableCell>{course.course_hours}</TableCell>
                    <TableCell>{course.program_name}</TableCell>
                    <TableCell>{course.term_number}</TableCell>
                    <TableCell>
                      <EditIcon onClick={() => handleCourseEdit(course)} />
                      <DeleteIcon onClick={() => handleCourseDelete(course)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid2>
      <CustomModal
        open={openEditCourseModal}
        onClose={() => setOpenEditCourseModal(false)}
        title="Edit Course"
        onConfirm={handleCourseUpdate}
        confirmText="Update"
      >
        {selectedCourse && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Course Name"
              name="course_name"
              value={selectedCourse.course_name || ""}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  course_name: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Course Code"
              name="course_code"
              value={selectedCourse.course_code || ""}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  course_code: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Course Hours"
              name="course_hours"
              value={selectedCourse.course_hours || ""}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  course_hours: e.target.value,
                })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Select Program</InputLabel>
              <Select
                value={selectedCourse.program_id || ""}
                onChange={(e) => {
                  const program = programList.find(
                    (p) => p.program_id === e.target.value
                  );
                  setTotalTerms(program ? program.total_terms : 0);
                  setSelectedCourse({
                    ...selectedCourse,
                    program_id: e.target.value,
                  });
                }}
              >
                {programList.map((program) => (
                  <MenuItem key={program.program_id} value={program.program_id}>
                    {program.program_code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Select Term</InputLabel>
              <Select
                value={selectedCourse.term || ""}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    term: e.target.value,
                  })
                }
                disabled={!totalTerms}
              >
                {[...Array(totalTerms)].map((_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </CustomModal>

      {/* Delete Course Modal */}
      <InfoModal
        open={openDeleteCourseModal}
        onClose={() => {
          setOpenDeleteCourseModal(false);
          setError(""); // Reset error state
        }}
        title="Confirm Deletion"
        onConfirm={confirmDeleteCourse}
        confirmText="Delete"
        cancelText="Cancel"
        message={` Are you sure you want to delete the course{" "}
          ${courseToDelete?.course_name}?`}
        error={deleteError}
      ></InfoModal>
    </Grid2>
  );
};

export default CourseCreation;
