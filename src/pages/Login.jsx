import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid2,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      // Make API call to login
      const response = await axios.post(
        "/api/auth/login", // This should be the relative URL, ensure your backend is running on the correct port
        { username: email, password: password },
        { withCredentials: true } // Ensures cookie is sent with the request
      );

      // Assuming the response contains user role and login message
      if (response.data.role === "Admin") {
        navigate("/admin/dashboard"); // Redirect to Admin Dashboard
      } else if (response.data.role === "Faculty") {
        navigate("/faculty/dashboard"); // Redirect to Faculty Dashboard
      }
    } catch (err) {
      setError("Invalid email or password."); // Show error if login fails
    }
  };

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Grid2 item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography
              variant="body2"
              color="error"
              textAlign="center"
              sx={{ marginBottom: 2 }}
            >
              {error}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default Login;
