import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loader = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <CircularProgress size={50} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
