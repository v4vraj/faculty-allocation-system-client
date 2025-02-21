import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  height: "75%",
  overflow: "auto",
  padding: "2%",
  margin: "2%",
};

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showActions = true,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        {children}
        {showActions && (
          <Box display="flex" gap={2} mt={3}>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              {cancelText}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;
