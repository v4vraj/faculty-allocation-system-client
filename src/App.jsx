import React from "react";
import { Button, Typography, Container } from "@mui/material";

const App = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to MUI with Vite
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Container>
  );
};

export default App;
