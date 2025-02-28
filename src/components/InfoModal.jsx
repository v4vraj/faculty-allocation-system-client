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
  type = "info", // New type prop: "success" | "error"
}) => {
  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography
          variant="h6"
          mb={2}
          color={
            isSuccess ? "success.main" : isError ? "error.main" : "text.primary"
          }
        >
          {title}
        </Typography>

        <Typography variant="body1" mb={3}>
          {message}
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color={isSuccess ? "success" : isError ? "error" : "primary"}
            onClick={onConfirm}
          >
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
