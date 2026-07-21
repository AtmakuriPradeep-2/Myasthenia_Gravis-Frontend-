import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Alert as MuiAlert,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";

import type { Alert } from "../../types/alert";
import type { Patient } from "../../types/patient";

interface ReviewAlertModalProps {
  open: boolean;
  alert: Alert | null;
  patient?: Patient;
  currentUsername?: string;
  onClose: () => void;
  onSubmit: (data: { status: string; review_notes?: string; reviewed_by?: string }) => Promise<void>;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "Open", label: "Open (Pending Evaluation)" },
  { value: "Under Review", label: "Under Review (Investigating)" },
  { value: "Escalated", label: "Escalated (Urgent Clinical Action)" },
  { value: "Resolved", label: "Resolved (Care Plan Updated)" },
  { value: "Closed", label: "Closed (Dismissed / Settled)" },
];

export default function ReviewAlertModal({
  open,
  alert,
  patient,
  currentUsername = "clinician",
  onClose,
  onSubmit,
  isLoading = false,
}: ReviewAlertModalProps) {
  const [status, setStatus] = useState<string>("Under Review");
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (alert) {
      setStatus(alert.status || "Under Review");
      setReviewNotes(alert.review_notes || "");
      setErrorMsg("");
    }
  }, [alert, open]);

  if (!alert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await onSubmit({
        status,
        review_notes: reviewNotes.trim() || undefined,
        reviewed_by: currentUsername,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Failed to update alert review status.");
    }
  };

  const probPercent = Math.round(alert.probability * 100);

  const getSeverityChip = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return <Chip icon={<ErrorIcon fontSize="small" />} label="CRITICAL SEVERITY" color="error" size="small" sx={{ fontWeight: 800 }} />;
      case "high":
        return <Chip icon={<WarningIcon fontSize="small" />} label="HIGH SEVERITY" color="warning" size="small" sx={{ fontWeight: 800 }} />;
      case "moderate":
        return <Chip icon={<NotificationsActiveIcon fontSize="small" />} label="MODERATE SEVERITY" color="info" size="small" sx={{ fontWeight: 800 }} />;
      default:
        return <Chip icon={<CheckCircleIcon fontSize="small" />} label="LOW SEVERITY" color="success" size="small" sx={{ fontWeight: 800 }} />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: "primary.50", color: "primary.main", display: "flex" }}>
          <NotificationsActiveIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            Review Clinical Alert #{alert.id}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Automated Risk Classification Assessment
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {errorMsg && (
            <MuiAlert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg}
            </MuiAlert>
          )}

          {/* Alert Context Summary Card */}
          <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
              {getSeverityChip(alert.severity)}
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                <ScheduleIcon fontSize="inherit" />
                Created: {new Date(alert.created_at).toLocaleString()}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center" mb={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Patient Code
                </Typography>
                <Typography variant="body1" fontWeight={800} color="primary.main">
                  {patient ? patient.patient_code : `Patient #${alert.patient_id}`}
                </Typography>
              </Box>

              {patient && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Demographics
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {patient.age} yrs • {patient.gender}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Predicted Risk Probability
                </Typography>
                <Typography variant="body1" fontWeight={800} color={probPercent >= 50 ? "error.main" : "warning.main"}>
                  {probPercent}%
                </Typography>
              </Box>
            </Stack>

            {/* Risk Probability Progress bar */}
            <Box sx={{ width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={probPercent}
                color={probPercent >= 80 ? "error" : probPercent >= 50 ? "warning" : "info"}
                sx={{ height: 8, borderRadius: 4, bgcolor: "#E2E8F0" }}
              />
            </Box>
          </Box>

          {/* Review Fields */}
          <TextField
            select
            label="Alert Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            required
            helperText="Update alert status based on clinical evaluation"
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Clinician Review Notes"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Record clinical assessment findings, observations, or rationale for status change..."
            helperText="Detailed clinical review documentation"
          />

          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
            <PersonIcon fontSize="small" />
            <Typography variant="caption" fontWeight={600}>
              Reviewing Clinician: <strong>{currentUsername}</strong>
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isLoading} color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={<CheckCircleIcon />}
            sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
          >
            {isLoading ? "Updating..." : "Save Review"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
