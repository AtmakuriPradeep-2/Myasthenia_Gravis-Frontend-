import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  InputAdornment,
  LinearProgress,
  Tooltip,
  Stack,
  Alert as MuiAlert,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ScheduleIcon from "@mui/icons-material/Schedule";
import toast from "react-hot-toast";

import { useAlerts, useUpdateAlert } from "../../hooks/useAlerts";
import { usePatients } from "../../hooks/usePatients";
import { useCreateIntervention } from "../../hooks/useInterventions";
import { useAuth } from "../../contexts/AuthContext";

import ReviewAlertModal from "../../components/alerts/ReviewAlertModal";
import LogInterventionModal from "../../components/interventions/LogInterventionModal";

import type { Alert } from "../../types/alert";
import type { Patient } from "../../types/patient";

export default function AlertsPage() {
  const { user } = useAuth();
  const currentUsername = user?.username || "clinician";

  // Data Queries & Mutations
  const { data: rawAlerts, isLoading, isError, refetch } = useAlerts();
  const { data: rawPatients } = usePatients();
  const updateAlertMutation = useUpdateAlert();
  const createInterventionMutation = useCreateIntervention();

  const alertsList: Alert[] = rawAlerts ?? [];
  const patientsList: Patient[] = rawPatients ?? [];

  // Patient Map for Quick Lookup
  const patientMap = useMemo(() => {
    const map = new Map<number, Patient>();
    patientsList.forEach((p) => map.set(p.id, p));
    return map;
  }, [patientsList]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patientFilter, setPatientFilter] = useState("All");

  // Modal States
  const [selectedReviewAlert, setSelectedReviewAlert] = useState<Alert | null>(null);
  const [selectedInterventionAlert, setSelectedInterventionAlert] = useState<Alert | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Filtered Alerts List
  const filteredAlerts = useMemo(() => {
    return alertsList.filter((item) => {
      const patient = patientMap.get(item.patient_id);
      const patientCode = patient?.patient_code?.toLowerCase() || "";
      const alertIdStr = item.id.toString();
      const notesStr = (item.review_notes || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        patientCode.includes(query) ||
        alertIdStr.includes(query) ||
        notesStr.includes(query);

      const matchesSeverity =
        severityFilter === "All" ||
        item.severity.toLowerCase() === severityFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPatient =
        patientFilter === "All" || item.patient_id === Number(patientFilter);

      return matchesSearch && matchesSeverity && matchesStatus && matchesPatient;
    });
  }, [alertsList, patientMap, searchTerm, severityFilter, statusFilter, patientFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = alertsList.length;
    const open = alertsList.filter((a) => a.status === "Open").length;
    const critical = alertsList.filter((a) => a.severity === "Critical").length;
    const underReview = alertsList.filter((a) => a.status === "Under Review" || a.status === "Escalated").length;
    const resolved = alertsList.filter((a) => a.status === "Resolved" || a.status === "Closed").length;
    return { total, open, critical, underReview, resolved };
  }, [alertsList]);

  // Handle Alert Review Submission
  const handleReviewSubmit = async (data: {
    status: string;
    review_notes?: string;
    reviewed_by?: string;
  }) => {
    if (!selectedReviewAlert) return;
    try {
      await updateAlertMutation.mutateAsync({
        id: selectedReviewAlert.id,
        data,
      });
      toast.success(`Alert #${selectedReviewAlert.id} status updated to ${data.status}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update alert review");
      throw err;
    }
  };

  // Handle Intervention Logging Submission
  const handleLogInterventionSubmit = async (data: {
    alert_id: number;
    patient_id: number;
    clinician: string;
    intervention_type: string;
    notes?: string;
    follow_up_date: string;
    autoResolveAlert?: boolean;
  }) => {
    try {
      // 1. Create Intervention Record
      await createInterventionMutation.mutateAsync({
        alert_id: data.alert_id,
        patient_id: data.patient_id,
        clinician: data.clinician,
        intervention_type: data.intervention_type,
        notes: data.notes,
        follow_up_date: data.follow_up_date,
      });

      toast.success("Clinical intervention logged successfully!");

      // 2. Auto-Resolve alert if requested
      if (data.autoResolveAlert) {
        await updateAlertMutation.mutateAsync({
          id: data.alert_id,
          data: {
            status: "Resolved",
            reviewed_by: data.clinician,
            review_notes: `Intervention logged: ${data.intervention_type}. ${data.notes || ""}`,
          },
        });
        toast.success(`Alert #${data.alert_id} automatically marked as Resolved.`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to record intervention.");
      throw err;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return (
          <Chip
            icon={<ErrorIcon fontSize="small" />}
            label="Critical"
            color="error"
            size="small"
            sx={{ fontWeight: 800, px: 0.5, boxShadow: "0 0 10px rgba(239,68,68,0.4)" }}
          />
        );
      case "high":
        return (
          <Chip
            icon={<WarningIcon fontSize="small" />}
            label="High"
            color="warning"
            size="small"
            sx={{ fontWeight: 800, px: 0.5 }}
          />
        );
      case "moderate":
        return (
          <Chip
            icon={<NotificationsActiveIcon fontSize="small" />}
            label="Moderate"
            color="info"
            size="small"
            sx={{ fontWeight: 800, px: 0.5 }}
          />
        );
      default:
        return (
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="Low"
            color="success"
            size="small"
            sx={{ fontWeight: 800, px: 0.5 }}
          />
        );
    }
  };

  const getStatusChip = (st: string) => {
    switch (st) {
      case "Open":
        return <Chip label="Open" color="error" variant="outlined" size="small" sx={{ fontWeight: 700 }} />;
      case "Under Review":
        return <Chip label="Under Review" color="info" size="small" sx={{ fontWeight: 700 }} />;
      case "Escalated":
        return <Chip label="Escalated" color="secondary" size="small" sx={{ fontWeight: 700 }} />;
      case "Resolved":
        return <Chip label="Resolved" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case "Closed":
        return <Chip label="Closed" color="default" size="small" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label={st} size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ─── Hero Header Bar ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: "rgba(239, 68, 68, 0.2)",
              color: "#EF4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              display: "flex",
            }}
          >
            <NotificationsActiveIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Alerts & Risk Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 500, mt: 0.5 }}>
              Real-time Machine Learning clinical risk alerts requiring clinician evaluation
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{
              color: "#F8FAFC",
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<MedicalServicesIcon />}
            onClick={() => {
              setSelectedInterventionAlert(null);
              setIsLogModalOpen(true);
            }}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 800,
              px: 3,
              boxShadow: "0 4px 14px rgba(239,68,68,0.4)",
            }}
          >
            Log Intervention
          </Button>
        </Stack>
      </Paper>

      {/* ─── Backend Error Alert ─── */}
      {isError && (
        <MuiAlert severity="error" sx={{ borderRadius: 3, fontWeight: 600 }}>
          Unable to fetch clinical alerts. Please verify backend API status.
        </MuiAlert>
      )}

      {/* ─── Metric KPI Cards ─── */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Total Alerts
              </Typography>
              <Typography variant="h4" color="#0F172A" sx={{ mt: 0.5, fontWeight: 800 }}>
                {metrics.total}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Lifetime Generated
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#FEF2F2", border: "1px solid #FCA5A5" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="error.dark" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
                Active Open Alerts
              </Typography>
              <Typography variant="h4" color="error.main" sx={{ mt: 0.5, fontWeight: 900 }}>
                {metrics.open}
              </Typography>
              <Typography variant="caption" color="error.dark" sx={{ fontWeight: 600 }}>
                Pending Evaluation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#FFF7ED", border: "1px solid #FDBA74" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
                Critical Severity
              </Typography>
              <Typography variant="h4" color="warning.main" sx={{ mt: 0.5, fontWeight: 900 }}>
                {metrics.critical}
              </Typography>
              <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 600 }}>
                Probability ≥ 80%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#EFF6FF", border: "1px solid #93C5FD" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
                Under Review
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ mt: 0.5, fontWeight: 800 }}>
                {metrics.underReview}
              </Typography>
              <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 600 }}>
                In Evaluation / Escalated
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#F0FDF4", border: "1px solid #86EFAC" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="success.dark" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
                Resolved / Closed
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ mt: 0.5, fontWeight: 800 }}>
                {metrics.resolved}
              </Typography>
              <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600 }}>
                Interventions Managed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Filter & Search Toolbar ─── */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by patient code, alert ID, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <MenuItem value="All">All Severities</MenuItem>
              <MenuItem value="Critical">Critical (≥ 80%)</MenuItem>
              <MenuItem value="High">High (50% - 79%)</MenuItem>
              <MenuItem value="Moderate">Moderate (20% - 49%)</MenuItem>
              <MenuItem value="Low">Low (&lt; 20%)</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Escalated">Escalated</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Patient"
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
            >
              <MenuItem value="All">All Patients</MenuItem>
              {patientsList.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.patient_code} (ID #{p.id})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* ─── Alerts Data Table ─── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "#FFFFFF" }}>
        {isLoading && <LinearProgress />}

        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Alert ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Patient Code</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Risk Probability</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Review / Notes</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "#475569" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <HourglassEmptyIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700 }}>
                        No alerts matching current filters
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alertItem) => {
                  const patient = patientMap.get(alertItem.patient_id);
                  const probPercent = Math.round(alertItem.probability * 100);

                  return (
                    <TableRow
                      key={alertItem.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#F8FAFC" },
                        bgcolor: alertItem.status === "Open" && alertItem.severity === "Critical" ? "#FEF2F2" : "inherit",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 800 }}>#{alertItem.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 800 }}>
                          {patient ? patient.patient_code : `Patient #${alertItem.patient_id}`}
                        </Typography>
                        {patient && (
                          <Typography variant="caption" color="text.secondary">
                            {patient.age}y • {patient.sex}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>{getSeverityBadge(alertItem.severity)}</TableCell>

                      <TableCell sx={{ width: 180 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                          <Typography
                            variant="body2"
                            color={probPercent >= 50 ? "error.main" : "warning.main"}
                            sx={{ fontWeight: 800 }}
                          >
                            {probPercent}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            risk
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={probPercent}
                          color={probPercent >= 80 ? "error" : probPercent >= 50 ? "warning" : "info"}
                          sx={{ height: 6, borderRadius: 3, bgcolor: "#E2E8F0" }}
                        />
                      </TableCell>

                      <TableCell>{getStatusChip(alertItem.status)}</TableCell>

                      <TableCell sx={{ maxWidth: 220 }}>
                        {alertItem.review_notes ? (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.825rem",
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            "{alertItem.review_notes}"
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            No review notes
                          </Typography>
                        )}
                        {alertItem.reviewed_by && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
                            By: {alertItem.reviewed_by}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
                          <ScheduleIcon fontSize="inherit" />
                          {new Date(alertItem.created_at).toLocaleDateString()}{" "}
                          {new Date(alertItem.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                          <Tooltip title="Review & Update Alert Status">
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<RateReviewIcon fontSize="small" />}
                              onClick={() => setSelectedReviewAlert(alertItem)}
                              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                            >
                              Review
                            </Button>
                          </Tooltip>

                          <Tooltip title="Log Direct Clinical Intervention">
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<MedicalServicesIcon fontSize="small" />}
                              onClick={() => {
                                setSelectedInterventionAlert(alertItem);
                                setIsLogModalOpen(true);
                              }}
                              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2 }}
                            >
                              Intervene
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ─── Review Alert Modal ─── */}
      <ReviewAlertModal
        open={!!selectedReviewAlert}
        alert={selectedReviewAlert}
        patient={selectedReviewAlert ? patientMap.get(selectedReviewAlert.patient_id) : undefined}
        currentUsername={currentUsername}
        onClose={() => setSelectedReviewAlert(null)}
        onSubmit={handleReviewSubmit}
        isLoading={updateAlertMutation.isPending}
      />

      {/* ─── Log Intervention Modal ─── */}
      <LogInterventionModal
        open={isLogModalOpen}
        prefilledAlert={selectedInterventionAlert}
        prefilledPatientId={selectedInterventionAlert?.patient_id}
        alertsList={alertsList}
        patientsList={patientsList}
        currentUsername={currentUsername}
        onClose={() => {
          setIsLogModalOpen(false);
          setSelectedInterventionAlert(null);
        }}
        onSubmit={handleLogInterventionSubmit}
        isLoading={createInterventionMutation.isPending}
      />
    </Box>
  );
}
