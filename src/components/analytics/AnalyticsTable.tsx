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
} from "@mui/material";
import dayjs from "dayjs";
import AssessmentIcon from "@mui/icons-material/Assessment";

import type { Patient } from "../../types/patient";

export interface RecordRow {
  id: number;
  patient_id: number;
  created_at: string;
  probability: number;
  risk_category: string;
  qmg_score?: number;
  mgc_score?: number;
}

interface Props {
  records: RecordRow[];
  patients: Patient[];
  isLoading: boolean;
}

const getRiskChipColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case "high":
      return { bg: "#FEF2F2", text: "#EF4444", border: "rgba(239, 68, 68, 0.3)" };
    case "moderate":
      return { bg: "#FFFBEB", text: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" };
    case "low":
      return { bg: "#ECFDF5", text: "#10B981", border: "rgba(16, 185, 129, 0.3)" };
    default:
      return { bg: "#F1F5F9", text: "#64748B", border: "rgba(100, 116, 139, 0.3)" };
  }
};

export default function AnalyticsTable({
  records,
  patients,
  isLoading,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const patientMap = new Map<number, Patient>();
  patients.forEach((p) => patientMap.set(p.id, p));

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginated = records.slice(
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
        <Table sx={{ minWidth: 680 }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>ID / Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Patient Code</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Risk Classification</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Exacerbation Risk %</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>QMG Score</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>MGC Score</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="text" width={100} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={110} height={28} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} /></TableCell>
                  <TableCell><Skeleton variant="text" width={70} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={50} height={28} /></TableCell>
                  <TableCell><Skeleton variant="text" width={50} height={28} /></TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center", maxWidth: 360, mx: "auto" }}>
                    <AssessmentIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                      No Risk Records Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      No analytical records match the selected date range filter criteria.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => {
                const patient = patientMap.get(item.patient_id);
                const code = patient?.patient_code ?? `Patient #${item.patient_id}`;
                const riskConfig = getRiskChipColor(item.risk_category);
                const probPct = ((item.probability ?? 0) * 100).toFixed(1);

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
                          {dayjs(item.created_at).format("MMM D, YYYY · HH:mm")}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#2563EB", fontSize: "0.95rem" }}>
                        {code}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${(item.risk_category || "Low").toUpperCase()} RISK`}
                        size="small"
                        sx={{
                          bgcolor: riskConfig.bg,
                          color: riskConfig.text,
                          fontWeight: 800,
                          border: `1px solid ${riskConfig.border}`,
                          fontSize: "0.72rem",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
                        {probPct}%
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: "#475569" }}>
                        {item.qmg_score !== undefined ? `${item.qmg_score} pts` : "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: "#475569" }}>
                        {item.mgc_score !== undefined ? `${item.mgc_score} pts` : "N/A"}
                      </Typography>
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
        count={records.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: "1px solid #E2E8F0" }}
      />
    </Paper>
  );
}
