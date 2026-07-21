import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  Typography,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";

import type { Patient } from "../../types/patient";

interface Props {
  patients: Patient[];
  isLoading: boolean;
  onViewDetails: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
}

const getMgfaChipColor = (mgfaClass: string) => {
  switch (mgfaClass?.toUpperCase()) {
    case "I":
      return { bg: "#ECFDF5", text: "#10B981", border: "rgba(16, 185, 129, 0.3)" };
    case "II":
      return { bg: "#ECFEFF", text: "#06B6D4", border: "rgba(6, 182, 212, 0.3)" };
    case "III":
      return { bg: "#EFF6FF", text: "#3B82F6", border: "rgba(59, 130, 246, 0.3)" };
    case "IV":
      return { bg: "#FFFBEB", text: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" };
    case "V":
      return { bg: "#FEF2F2", text: "#EF4444", border: "rgba(239, 68, 68, 0.3)" };
    default:
      return { bg: "#F1F5F9", text: "#64748B", border: "rgba(100, 116, 139, 0.3)" };
  }
};

export default function PatientTable({
  patients,
  isLoading,
  onViewDetails,
  onEditPatient,
  onDeletePatient,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu State for Row Actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, patient: Patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPatients = patients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>ID / Patient Code</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Sex</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>MGFA Classification</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#475569", pr: 3 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="text" width={120} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={50} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 2 }} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={32} height={32} sx={{ ml: "auto" }} /></TableCell>
                </TableRow>
              ))
            ) : paginatedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center", maxWidth: 360, mx: "auto" }}>
                    <PersonSearchRoundedIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                      No Patients Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      No matching patient records match your filter criteria or search query.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPatients.map((patient) => {
                const mgfaConfig = getMgfaChipColor(patient.mgfa_class);

                return (
                  <TableRow
                    key={patient.id}
                    hover
                    sx={{
                      transition: "bgcolor 0.2s ease",
                      "&:hover": { bgcolor: "#F8FAFC" },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Chip
                          label={`ID: ${patient.id}`}
                          size="small"
                          sx={{
                            bgcolor: "#F1F5F9",
                            color: "#475569",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            height: 22,
                          }}
                        />
                        <Typography sx={{ fontWeight: 700, color: "#2563EB", fontSize: "0.95rem" }}>
                          {patient.patient_code}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: "#0F172A" }}>
                        {patient.age} yrs
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={patient.sex}
                        size="small"
                        sx={{
                          bgcolor: patient.sex === "Male" ? "#EFF6FF" : "#FDF2F8",
                          color: patient.sex === "Male" ? "#2563EB" : "#DB2777",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`MGFA Class ${patient.mgfa_class}`}
                        size="small"
                        sx={{
                          bgcolor: mgfaConfig.bg,
                          color: mgfaConfig.text,
                          fontWeight: 700,
                          border: `1px solid ${mgfaConfig.border}`,
                          px: 0.5,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="View Profile Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewDetails(patient)}
                            sx={{ color: "#2563EB", "&:hover": { bgcolor: "rgba(37,99,235,0.08)" } }}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenMenu(e, patient)}
                          sx={{ color: "#64748B" }}
                        >
                          <MoreVertRoundedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              borderRadius: 3,
              minWidth: 160,
              border: "1px solid #E2E8F0",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedPatient) onViewDetails(selectedPatient);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <VisibilityRoundedIcon fontSize="small" sx={{ color: "#2563EB" }} />
          </ListItemIcon>
          <ListItemText primary="View Details" slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: 600 } } }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedPatient) onEditPatient(selectedPatient);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" sx={{ color: "#F59E0B" }} />
          </ListItemIcon>
          <ListItemText primary="Edit Record" slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: 600 } } }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedPatient) onDeletePatient(selectedPatient);
            handleCloseMenu();
          }}
          sx={{ color: "#EF4444" }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText primary="Delete" slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: 600 } } }} />
        </MenuItem>
      </Menu>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={patients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: "1px solid #E2E8F0" }}
      />
    </Paper>
  );
}
