// src/pages/FacultyDashboard.js
import React from "react";
import { Box, AppBar, Toolbar, Typography, CssBaseline } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const FacultyDashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Faculty Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <Toolbar />
        <Typography component>
          Welcome to the Faculty dashboard! This is where your main content will
          go.
        </Typography>
        {/* Add more content or components here */}
      </main>
    </div>
  );
};

export default FacultyDashboard;
