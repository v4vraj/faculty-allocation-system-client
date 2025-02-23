import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
  textAlign: "center",
};

const InfoModal = ({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  error = "", // New error prop
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        <Typography variant="body1" mb={3}>
          {message}
        </Typography>

        {/* Error message */}
        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="error" onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            {cancelText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InfoModal;
