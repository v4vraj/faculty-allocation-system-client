import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Link,
  Box,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const BulkUpload = ({ type, demoFile }) => {
  const [file, setFile] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [uploadError, setUploadError] = React.useState(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length > 0) {
        setColumns(Object.keys(jsonData[0]));
        setTableData(jsonData.slice(0, 5)); // Preview first 5 rows
      } else {
        setTableData([]);
        setColumns([]);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUploadToBackend = async () => {
    if (!file) {
      setUploadError("No file selected. Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await axios.post("/api/bulkUpload/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadSuccess(response.data.message);
      setUploadError(null);
      setFile(null);
      setTableData([]);
      setColumns([]);
    } catch (error) {
      setUploadError(
        error.response?.data?.error ||
          "Failed to upload file. Please try again."
      );
      setUploadSuccess(null);
    }
  };

  return (
    <Card sx={{ mb: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Upload {type}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Select File
              <VisuallyHiddenInput
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
              />
            </Button>
            {file && <Typography variant="body1">{file.name}</Typography>}
          </Stack>

          {demoFile && (
            <Link href={demoFile} download>
              <Button variant="outlined" color="secondary">
                Download {type} Template
              </Button>
            </Link>
          )}
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Download the template to ensure your Excel file follows the correct
            format before uploading.
          </Typography>

          {uploadSuccess && <Alert severity="success">{uploadSuccess}</Alert>}
          {uploadError && <Alert severity="error">{uploadError}</Alert>}

          {file && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadToBackend}
            >
              Confirm & Upload
            </Button>
          )}

          {tableData.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{ mt: 2, maxHeight: 300, boxShadow: 2 }}
            >
              <Typography variant="subtitle1" sx={{ p: 1 }}>
                Preview (First 5 Rows)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell key={index} sx={{ fontWeight: "bold" }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((col, colIndex) => (
                        <TableCell key={colIndex}>{row[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const UploadSection = () => {
  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      <BulkUpload type="Courses" demoFile="/assets/courseDemo.xlsx" />
      <BulkUpload type="users" demoFile="/assets/facultyDemo.xlsx" />
      <BulkUpload type="Programs" demoFile="/assets/programDemo.xlsx" />
    </Box>
  );
};

export default UploadSection;
