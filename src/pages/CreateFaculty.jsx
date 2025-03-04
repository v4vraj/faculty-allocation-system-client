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
  CardContent,
} from "@mui/material";
import axios from "axios";
import InfoModal from "../components/InfoModal";

const roles = ["Admin", "Faculty"];
const positions = [
  "Professor",
  "Assistant Professor",
  "Visiting Professor",
  "Associate Professor",
];

const CreateFaculty = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("facultyFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          username: "",
          password: "",
          selectedRole: "",
          department: "",
          selectedPosition: "",
          maxHours: "",
          allocatedHours: "",
          hoursCompleted: "",
        };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("facultyFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/create-faculty`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          username: formData.username,
          password: formData.password,
          selectedRole: formData.selectedRole,
          department: formData.department,
          selectedPosition: formData.selectedPosition,
          maxHours: formData.maxHours,
          allocatedHours: formData.allocatedHours,
          hoursCompleted: formData.hoursCompleted,
        }
      );
      setSuccessMsg(res.data.message);
      setOpenSuccessModal(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        username: "",
        password: "",
        selectedRole: "",
        department: "",
        selectedPosition: "",
        maxHours: "",
        allocatedHours: "",
        hoursCompleted: "",
      });
      localStorage.removeItem("facultyFormData");
      setStep(1);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid2 container spacing={3} sx={{ p: 4 }}>
      {/* Form Section */}
      <Grid2 item xs={12} md={6} size={6}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {step === 1 && (
                <>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="selectedRole"
                      value={formData.selectedRole}
                      onChange={handleChange}
                      required
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <FormControl fullWidth>
                    <InputLabel>Position</InputLabel>
                    <Select
                      name="selectedPosition"
                      value={formData.selectedPosition}
                      onChange={handleChange}
                      required
                    >
                      {positions.map((position) => (
                        <MenuItem key={position} value={position}>
                          {position}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {step === 3 && (
                <>
                  <TextField
                    label="Max Hours"
                    name="maxHours"
                    type="number"
                    value={formData.maxHours}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Allocated Hours"
                    name="allocatedHours"
                    type="number"
                    value={formData.allocatedHours}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Hours Completed"
                    name="hoursCompleted"
                    type="number"
                    value={formData.hoursCompleted}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </>
              )}

              {error && <div style={{ color: "red" }}>{error}</div>}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {step > 1 && (
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </Grid2>

      {/* Display Submitted Data */}
      <Grid2 item xs={12} md={6} size={6}>
        <Card sx={{ p: 3 }}>
          <CardContent>
            <h1>Course Details</h1>
            <p>
              <strong>First Name:</strong>{" "}
              {formData.firstName || "Not Provided"}
            </p>
            <p>
              <strong>Last Name:</strong> {formData.lastName || "Not Provided"}
            </p>
            <p>
              <strong>Email:</strong> {formData.email || "Not Provided"}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {formData.phoneNumber || "Not Provided"}
            </p>
            <p>
              <strong>Username:</strong> {formData.username || "Not Provided"}
            </p>
            <p>
              <strong>Role:</strong> {formData.selectedRole || "Not Provided"}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {formData.department || "Not Provided"}
            </p>
            <p>
              <strong>Position:</strong>{" "}
              {formData.selectedPosition || "Not Provided"}
            </p>
            <p>
              <strong>Max Hours:</strong> {formData.maxHours || "Not Provided"}
            </p>
            <p>
              <strong>Allocated Hours:</strong>{" "}
              {formData.allocatedHours || "Not Provided"}
            </p>
            <p>
              <strong>Hours Completed:</strong>{" "}
              {formData.hoursCompleted || "Not Provided"}
            </p>
          </CardContent>
        </Card>
      </Grid2>
      {/* Success Modal */}
      <InfoModal
        open={openSuccessModal}
        onClose={() => {
          setOpenSuccessModal(false);
          setSuccessMsg("");
        }}
        title="Success!"
        onConfirm={() => {
          setOpenSuccessModal(false);
        }}
        message={successMsg}
        type="success" // Indicates this is a success modal
      />
    </Grid2>
  );
};

export default CreateFaculty;
