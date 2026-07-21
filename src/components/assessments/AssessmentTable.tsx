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
  TablePagination,
  Box,
  Typography,
  Skeleton,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MedsIcon from "@mui/icons-material/MedicalServices";
import BugReportIcon from "@mui/icons-material/BugReport";

import type { Assessment } from "../../types/assessment";
import type { Patient } from "../../types/patient";

interface Props {
  assessments: Assessment[];
  patients: Patient[];
  isLoading: boolean;
}

export default function AssessmentTable({
  assessments,
  patients,
  isLoading,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Map patient_id to patient_code for display
  const patientMap = new Map<number, Patient>();
  patients.forEach((p) => patientMap.set(p.id, p));

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginated = assessments.slice(
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
        <Table sx={{ minWidth: 720 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>ID / Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Patient Code</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>QMG Score (0-39)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>MGC Score (0-50)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>CFQ Total (0-28)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Treatment Regimen</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Infection Flag</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="text" width={100} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={110} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} /></TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center", maxWidth: 360, mx: "auto" }}>
                    <AssessmentIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                      No Assessment Records
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      No matching clinical assessment records found for selected filter criteria.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => {
                const patient = patientMap.get(item.patient_id);
                const code = patient?.patient_code ?? `Patient #${item.patient_id}`;

                return (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      transition: "bgcolor 0.2s ease",
                      "&:hover": { bgcolor: "#F8FAFC" },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box>
                        <Chip
                          label={`ID: #${item.id}`}
                          size="small"
                          sx={{
                            bgcolor: "#F1F5F9",
                            color: "#475569",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            height: 20,
                            mb: 0.25,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontWeight: 600 }}>
                          {dayjs(item.observation_date).format("MMM D, YYYY · HH:mm")}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#2563EB", fontSize: "0.95rem" }}>
                        {code}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Quantitative Myasthenia Gravis Score">
                        <Chip
                          label={`${item.qmg_score} pts`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(37, 99, 235, 0.1)",
                            color: "#2563EB",
                            fontWeight: 800,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Myasthenia Gravis Composite Score">
                        <Chip
                          label={`${item.mgc_score} pts`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(147, 51, 234, 0.1)",
                            color: "#9333EA",
                            fontWeight: 800,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Clinical Fatigue Questionnaire Total">
                        <Chip
                          label={`${item.cfq_total} pts`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(217, 119, 6, 0.1)",
                            color: "#D97706",
                            fontWeight: 800,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={<MedsIcon sx={{ fontSize: "12px !important" }} />}
                        label={item.treatment_change === 1 ? "Adjusted" : "Unchanged"}
                        size="small"
                        sx={{
                          bgcolor: item.treatment_change === 1 ? "#FEF3C7" : "#F1F5F9",
                          color: item.treatment_change === 1 ? "#D97706" : "#64748B",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={<BugReportIcon sx={{ fontSize: "12px !important" }} />}
                        label={item.infection_event === 1 ? "Reported" : "None"}
                        size="small"
                        sx={{
                          bgcolor: item.infection_event === 1 ? "#FEE2E2" : "#ECFDF5",
                          color: item.infection_event === 1 ? "#EF4444" : "#10B981",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={assessments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: "1px solid #E2E8F0" }}
      />
    </Paper>
  );
}
