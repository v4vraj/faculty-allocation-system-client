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
  Box,
  TextField,
  Button,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CustomModal from "../components/CustomModal";

const AdminDashboard = () => {
  const [faculty, setFaculty] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [facultyStats, setFacultyStats] = useState([]);
  const [programStats, setProgramStats] = useState([]);
  const [openEditFacultyModal, setOpenEditFacultyModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [openDeleteFacultyModal, setOpenDeleteFacultyModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [openEditProgramModal, setOpenEditProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [openDeleteProgramModal, setOpenDeleteProgramModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/getAllFaculty");
      setFaculty(res.data);

      const roleData = { Faculty: 0 };
      res.data.forEach((user) => {
        roleData[user.role] = (roleData[user.role] || 0) + 1;
      });

      setFacultyStats(
        Object.entries(roleData).map(([role, count]) => ({ role, count }))
      );
    } catch (error) {
      setError("Error fetching faculty");
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/programs/getAllPrograms");
      setPrograms(res.data);

      const yearData = {};
      res.data.forEach((program) => {
        const year = program.start_year;
        yearData[year] = (yearData[year] || 0) + 1;
      });

      setProgramStats(
        Object.entries(yearData).map(([year, count]) => ({ year, count }))
      );
    } catch (error) {
      setError("Error fetching programs");
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
    fetchPrograms();
  }, []);

  const handleFacultyEdit = (facultyData) => {
    setSelectedFaculty(facultyData);
    setOpenEditFacultyModal(true);
  };

  const handleInputChange = (e) => {
    setSelectedFaculty({ ...selectedFaculty, [e.target.name]: e.target.value });
  };

  const handleFacultyUpdate = async () => {
    try {
      await axios.put(
        `/api/users/updateFacultyById/${selectedFaculty.id}`,
        selectedFaculty
      );
      setOpenEditFacultyModal(false);
      fetchFaculty();
    } catch (error) {
      console.error("Error updating faculty:", error);
    }
  };

  const handleFacultyDelete = (facultyData) => {
    setFacultyToDelete(facultyData);
    setOpenDeleteFacultyModal(true);
  };

  const confirmDeleteFaculty = async () => {
    try {
      await axios.delete(`/api/users/deleteFacultyById/${facultyToDelete.id}`);
      setOpenDeleteFacultyModal(false);
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const handleProgramEdit = (programData) => {
    setSelectedProgram(programData);
    setOpenEditProgramModal(true);
  };

  const handleProgramUpdate = async () => {
    try {
      await axios.put(
        `/api/programs/updateProgramById/${selectedProgram.program_id}`,
        selectedProgram
      );
      setOpenEditProgramModal(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error updating program:", error);
    }
  };

  const handleProgramDelete = (programData) => {
    setProgramToDelete(programData);
    setOpenDeleteProgramModal(true);
  };

  const confirmDeleteProgram = async () => {
    try {
      await axios.delete(
        `/api/programs/deleteProgramById/${programToDelete.program_id}`
      );
      setOpenDeleteProgramModal(false);
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <div style={{ padding: "20px" }}>
        {/* Charts Section */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <Card sx={{ flex: 1, padding: 2 }}>
            <CardContent>
              <Typography variant="h6">Faculty Count</Typography>
              <BarChart
                dataset={facultyStats}
                xAxis={[{ scaleType: "band", dataKey: "role" }]}
                series={[{ dataKey: "count", label: "Faculty Count" }]}
                width={500}
                height={300}
              />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, padding: 2 }}>
            <CardContent>
              <Typography variant="h6">Programs Count by Year</Typography>
              <BarChart
                dataset={programStats}
                xAxis={[{ scaleType: "band", dataKey: "year" }]}
                series={[{ dataKey: "count", label: "Programs Count" }]}
                width={500}
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
                  <TableCell>Actions</TableCell>
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
                    <TableCell>
                      <EditIcon onClick={() => handleFacultyEdit(user)} />
                      <DeleteIcon onClick={() => handleFacultyDelete(user)} />
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
                  <TableCell>Actions</TableCell>
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
                    <TableCell>
                      <EditIcon onClick={() => handleProgramEdit(program)} />
                      <DeleteIcon
                        onClick={() => handleProgramDelete(program)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Faculty Modal */}
      <CustomModal
        open={openEditFacultyModal}
        onClose={() => setOpenEditFacultyModal(false)}
        title="Edit Faculty"
        onConfirm={handleFacultyUpdate}
        confirmText="Update"
      >
        {selectedFaculty && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={selectedFaculty.first_name || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={selectedFaculty.last_name || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={selectedFaculty.email || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={selectedFaculty.phone_number || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={selectedFaculty.department || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={selectedFaculty.position || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Max Hours"
              name="max_hours"
              value={selectedFaculty.max_hours || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Allocated Hours"
              name="allocated_hours"
              value={selectedFaculty.allocated_hours || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Hours Completed"
              name="hours_completed"
              value={selectedFaculty.hours_completed || ""}
              onChange={handleInputChange}
            />
          </Box>
        )}
      </CustomModal>

      {/* Delete Faculty Modal */}
      <CustomModal
        open={openDeleteFacultyModal}
        onClose={() => setOpenDeleteFacultyModal(false)}
        title="Confirm Deletion"
        onConfirm={confirmDeleteFaculty}
        confirmText="Delete"
        cancelText="Cancel"
      >
        <Typography>
          Are you sure you want to delete faculty member{" "}
          {facultyToDelete?.first_name} {facultyToDelete?.last_name}?
        </Typography>
      </CustomModal>

      {/* Edit Program Modal */}
      <CustomModal
        open={openEditProgramModal}
        onClose={() => setOpenEditProgramModal(false)}
        title="Edit Program"
        onConfirm={handleProgramUpdate}
        confirmText="Update"
      >
        {selectedProgram && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Program Code"
              name="program_code"
              value={selectedProgram.program_code || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Program Name"
              name="program_name"
              value={selectedProgram.program_name || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Start Year"
              name="start_year"
              value={selectedProgram.start_year || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="End Year"
              name="end_year"
              value={selectedProgram.end_year || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Term Type"
              name="term_type"
              value={selectedProgram.term_type || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Total Terms"
              name="total_terms"
              value={selectedProgram.total_terms || ""}
              onChange={(e) =>
                setSelectedProgram({
                  ...selectedProgram,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Box>
        )}
      </CustomModal>

      {/* Delete Program Modal */}
      <CustomModal
        open={openDeleteProgramModal}
        onClose={() => setOpenDeleteProgramModal(false)}
        title="Confirm Deletion"
        onConfirm={confirmDeleteProgram}
        confirmText="Delete"
        cancelText="Cancel"
      >
        <Typography>
          Are you sure you want to delete program{" "}
          {programToDelete?.program_name}?
        </Typography>
      </CustomModal>
    </>
  );
};

export default AdminDashboard;
