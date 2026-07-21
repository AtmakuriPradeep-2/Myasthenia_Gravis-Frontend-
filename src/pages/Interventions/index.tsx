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
  Stack,
  Alert as MuiAlert,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicationIcon from "@mui/icons-material/Medication";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import TuneIcon from "@mui/icons-material/Tune";
import toast from "react-hot-toast";

import { useInterventions, useCreateIntervention } from "../../hooks/useInterventions";
import { useAlerts, useUpdateAlert } from "../../hooks/useAlerts";
import { usePatients } from "../../hooks/usePatients";
import { useAuth } from "../../contexts/AuthContext";

import LogInterventionModal from "../../components/interventions/LogInterventionModal";

import type { Intervention } from "../../types/intervention";
import type { Alert } from "../../types/alert";
import type { Patient } from "../../types/patient";

export default function InterventionsPage() {
  const { user } = useAuth();
  const currentUsername = user?.username || "clinician";

  // Data Queries & Mutations
  const { data: rawInterventions, isLoading, isError, refetch } = useInterventions();
  const { data: rawAlerts } = useAlerts();
  const { data: rawPatients } = usePatients();
  const createInterventionMutation = useCreateIntervention();
  const updateAlertMutation = useUpdateAlert();

  const interventionsList: Intervention[] = rawInterventions ?? [];
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
  const [typeFilter, setTypeFilter] = useState("All");
  const [patientFilter, setPatientFilter] = useState("All");

  // Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Filtered Interventions
  const filteredInterventions = useMemo(() => {
    return interventionsList.filter((item) => {
      const patient = patientMap.get(item.patient_id);
      const patientCode = patient?.patient_code?.toLowerCase() || "";
      const clinician = (item.clinician || "").toLowerCase();
      const notes = (item.notes || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        patientCode.includes(query) ||
        clinician.includes(query) ||
        notes.includes(query) ||
        item.id.toString().includes(query);

      const matchesType =
        typeFilter === "All" ||
        item.intervention_type.toLowerCase() === typeFilter.toLowerCase();

      const matchesPatient =
        patientFilter === "All" || item.patient_id === Number(patientFilter);

      return matchesSearch && matchesType && matchesPatient;
    });
  }, [interventionsList, patientMap, searchTerm, typeFilter, patientFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = interventionsList.length;
    const medication = interventionsList.filter((i) =>
      i.intervention_type.toLowerCase().includes("medication")
    ).length;
    const emergency = interventionsList.filter(
      (i) =>
        i.intervention_type.toLowerCase().includes("emergency") ||
        i.intervention_type.toLowerCase().includes("referral")
    ).length;

    const todayStr = new Date().toISOString().split("T")[0];
    const upcomingFollowUps = interventionsList.filter((i) => i.follow_up_date >= todayStr).length;

    return { total, medication, emergency, upcomingFollowUps };
  }, [interventionsList]);

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
      await createInterventionMutation.mutateAsync({
        alert_id: data.alert_id,
        patient_id: data.patient_id,
        clinician: data.clinician,
        intervention_type: data.intervention_type,
        notes: data.notes,
        follow_up_date: data.follow_up_date,
      });

      toast.success("Clinical intervention logged successfully!");

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
      toast.error(err?.response?.data?.detail || "Failed to record clinical intervention.");
      throw err;
    }
  };

  const getInterventionIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("medication")) return <MedicationIcon fontSize="small" />;
    if (lower.includes("emergency") || lower.includes("referral")) return <LocalHospitalIcon fontSize="small" />;
    if (lower.includes("telehealth") || lower.includes("consult")) return <PhoneInTalkIcon fontSize="small" />;
    if (lower.includes("therapy")) return <TuneIcon fontSize="small" />;
    return <MedicalServicesIcon fontSize="small" />;
  };

  const getTypeChip = (type: string) => {
    const icon = getInterventionIcon(type);
    const lower = type.toLowerCase();
    let color: "primary" | "secondary" | "error" | "warning" | "info" | "success" = "primary";

    if (lower.includes("medication")) color = "primary";
    else if (lower.includes("emergency")) color = "error";
    else if (lower.includes("telehealth")) color = "info";
    else if (lower.includes("therapy")) color = "secondary";

    return <Chip icon={icon} label={type} color={color} size="small" sx={{ fontWeight: 800 }} />;
  };

  const getFollowUpStatusChip = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(dateStr);

    const diffDays = Math.ceil((followUp.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return (
        <Chip
          icon={<EventIcon fontSize="small" />}
          label={`Overdue (${Math.abs(diffDays)}d ago)`}
          color="error"
          variant="outlined"
          size="small"
          sx={{ fontWeight: 700 }}
        />
      );
    } else if (diffDays === 0) {
      return (
        <Chip
          icon={<EventIcon fontSize="small" />}
          label="Due Today"
          color="warning"
          size="small"
          sx={{ fontWeight: 800 }}
        />
      );
    } else {
      return (
        <Chip
          icon={<EventIcon fontSize="small" />}
          label={`Scheduled in ${diffDays}d (${dateStr})`}
          color="success"
          variant="outlined"
          size="small"
          sx={{ fontWeight: 700 }}
        />
      );
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
          background: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          boxShadow: "0 10px 30px rgba(6,95,70,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              display: "flex",
            }}
          >
            <MedicalServicesIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Clinical Interventions Log
            </Typography>
            <Typography variant="body2" sx={{ color: "#A7F3D0", fontWeight: 500, mt: 0.5 }}>
              Track medical management plans, dosage adjustments, and patient follow-up schedules
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{
              color: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.3)",
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<MedicalServicesIcon />}
            onClick={() => setIsLogModalOpen(true)}
            sx={{
              borderRadius: 2.5,
              bgcolor: "#FFFFFF",
              color: "#065F46",
              textTransform: "none",
              fontWeight: 800,
              px: 3,
              "&:hover": { bgcolor: "#ECFDF5" },
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            + Log New Intervention
          </Button>
        </Stack>
      </Paper>

      {/* ─── Backend Error Alert ─── */}
      {isError && (
        <MuiAlert severity="error" sx={{ borderRadius: 3, fontWeight: 600 }}>
          Unable to fetch clinical interventions. Please check API connection.
        </MuiAlert>
      )}

      {/* ─── Metric KPI Cards ─── */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Total Interventions
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ mt: 0.5 }}>
                {metrics.total}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Executed Care Actions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="primary.dark" fontWeight={800} textTransform="uppercase">
                Medication Adjustments
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary.main" sx={{ mt: 0.5 }}>
                {metrics.medication}
              </Typography>
              <Typography variant="caption" color="primary.dark" fontWeight={600}>
                Dose & Therapy Tweaks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#FEF2F2", border: "1px solid #FCA5A5" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="error.dark" fontWeight={800} textTransform="uppercase">
                Emergency & Referrals
              </Typography>
              <Typography variant="h4" fontWeight={900} color="error.main" sx={{ mt: 0.5 }}>
                {metrics.emergency}
              </Typography>
              <Typography variant="caption" color="error.dark" fontWeight={600}>
                Acute Clinical Actions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, bgcolor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography variant="caption" color="success.dark" fontWeight={800} textTransform="uppercase">
                Scheduled Follow-Ups
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main" sx={{ mt: 0.5 }}>
                {metrics.upcomingFollowUps}
              </Typography>
              <Typography variant="caption" color="success.dark" fontWeight={600}>
                Upcoming Clinical Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Filter & Search Toolbar ─── */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by patient code, clinician, or intervention notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Intervention Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Medication Adjustment">Medication Adjustment</MenuItem>
              <MenuItem value="Emergency Evaluation">Emergency Evaluation</MenuItem>
              <MenuItem value="Telehealth Consult">Telehealth Consult</MenuItem>
              <MenuItem value="Therapy Change">Therapy Change</MenuItem>
              <MenuItem value="Clinical Follow-up">Clinical Follow-up</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
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

      {/* ─── Interventions Table ─── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden", bgcolor: "#FFFFFF" }}>
        {isLoading && <LinearProgress color="success" />}

        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Intervention Type</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Clinician</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Follow-Up Date</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Clinical Action Notes</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Linked Alert</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Recorded At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInterventions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <HourglassEmptyIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                      <Typography variant="body1" fontWeight={700} color="text.secondary">
                        No clinical interventions recorded matching criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInterventions.map((item) => {
                  const patient = patientMap.get(item.patient_id);

                  return (
                    <TableRow key={item.id} hover sx={{ "&:hover": { bgcolor: "#F8FAFC" } }}>
                      <TableCell sx={{ fontWeight: 800 }}>#{item.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800} color="primary.main">
                          {patient ? patient.patient_code : `Patient #${item.patient_id}`}
                        </Typography>
                        {patient && (
                          <Typography variant="caption" color="text.secondary">
                            {patient.age}y • {patient.gender}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>{getTypeChip(item.intervention_type)}</TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PersonIcon fontSize="inherit" color="action" />
                          {item.clinician}
                        </Typography>
                      </TableCell>

                      <TableCell>{getFollowUpStatusChip(item.follow_up_date)}</TableCell>

                      <TableCell sx={{ maxWidth: 280 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.85rem",
                            color: "text.primary",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.notes || "No additional clinical notes recorded."}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`Alert #${item.alert_id}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                          <ScheduleIcon fontSize="inherit" />
                          {new Date(item.created_at).toLocaleDateString()}{" "}
                          {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ─── Log Intervention Modal ─── */}
      <LogInterventionModal
        open={isLogModalOpen}
        alertsList={alertsList}
        patientsList={patientsList}
        currentUsername={currentUsername}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleLogInterventionSubmit}
        isLoading={createInterventionMutation.isPending}
      />
    </Box>
  );
}
