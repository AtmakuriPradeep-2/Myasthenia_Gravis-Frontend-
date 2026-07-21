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
  FormControlLabel,
  Checkbox,
  Alert as MuiAlert,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SaveIcon from "@mui/icons-material/Save";
import type { Alert } from "../../types/alert";
import type { Patient } from "../../types/patient";

interface LogInterventionModalProps {
  open: boolean;
  prefilledAlert?: Alert | null;
  prefilledPatientId?: number;
  alertsList?: Alert[];
  patientsList?: Patient[];
  currentUsername?: string;
  onClose: () => void;
  onSubmit: (data: {
    alert_id: number;
    patient_id: number;
    clinician: string;
    intervention_type: string;
    notes?: string;
    follow_up_date: string;
    autoResolveAlert?: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

const INTERVENTION_TYPES = [
  "Medication Adjustment",
  "Emergency Evaluation",
  "Telehealth Consult",
  "Therapy Change",
  "Clinical Follow-up",
  "Hospital Referral",
];

export default function LogInterventionModal({
  open,
  prefilledAlert,
  prefilledPatientId,
  alertsList = [],
  patientsList = [],
  currentUsername = "clinician",
  onClose,
  onSubmit,
  isLoading = false,
}: LogInterventionModalProps) {
  const [selectedAlertId, setSelectedAlertId] = useState<number | string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<number | string>("");
  const [interventionType, setInterventionType] = useState<string>("Medication Adjustment");
  const [notes, setNotes] = useState<string>("");
  const [followUpDate, setFollowUpDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [autoResolveAlert, setAutoResolveAlert] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (open) {
      setErrorMsg("");

      if (prefilledAlert) {
        setSelectedAlertId(prefilledAlert.id);
        setSelectedPatientId(prefilledAlert.patient_id);
      } else if (prefilledPatientId) {
        setSelectedPatientId(prefilledPatientId);
        const alertForPatient = alertsList.find((a) => a.patient_id === prefilledPatientId);
        if (alertForPatient) {
          setSelectedAlertId(alertForPatient.id);
        } else if (alertsList.length > 0) {
          setSelectedAlertId(alertsList[0].id);
        }
      } else {
        if (alertsList.length > 0) {
          setSelectedAlertId(alertsList[0].id);
          setSelectedPatientId(alertsList[0].patient_id);
        }
      }
    }
  }, [open, prefilledAlert, prefilledPatientId, alertsList]);

  // When alert changes, sync patient_id
  const handleAlertChange = (alertIdNum: number) => {
    setSelectedAlertId(alertIdNum);
    const targetAlert = alertsList.find((a) => a.id === alertIdNum);
    if (targetAlert) {
      setSelectedPatientId(targetAlert.patient_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedAlertId) {
      setErrorMsg("Please select an alert associated with this intervention.");
      return;
    }

    if (!selectedPatientId) {
      setErrorMsg("Please select a patient.");
      return;
    }

    if (!followUpDate) {
      setErrorMsg("Please specify a valid follow-up date.");
      return;
    }

    try {
      await onSubmit({
        alert_id: Number(selectedAlertId),
        patient_id: Number(selectedPatientId),
        clinician: currentUsername,
        intervention_type: interventionType,
        notes: notes.trim() || undefined,
        follow_up_date: followUpDate,
        autoResolveAlert,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Failed to record clinical intervention.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: "success.50", color: "success.main", display: "flex" }}>
          <MedicalServicesIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            Log Clinical Intervention
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Record therapeutic actions & medical management plan
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

          {/* Linked Alert & Patient Selection */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Target Alert"
              value={selectedAlertId}
              onChange={(e) => handleAlertChange(Number(e.target.value))}
              fullWidth
              required
              disabled={!!prefilledAlert}
              helperText="Alert triggering intervention"
            >
              {alertsList.map((alt) => (
                <MenuItem key={alt.id} value={alt.id}>
                  Alert #{alt.id} (Patient #{alt.patient_id} - {alt.severity})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Patient Code"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(Number(e.target.value))}
              fullWidth
              required
              disabled={!!prefilledAlert}
              helperText="Subject patient"
            >
              {patientsList.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.patient_code} (ID #{p.id})
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {/* Intervention Details */}
          <TextField
            select
            label="Intervention Type"
            value={interventionType}
            onChange={(e) => setInterventionType(e.target.value)}
            fullWidth
            required
            helperText="Select primary clinical response action"
          >
            {INTERVENTION_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Scheduled Follow-Up Date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            fullWidth
            required
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Date for clinical evaluation of intervention outcome"
          />

          <TextField
            label="Clinical Action Notes & Medication Protocol"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Describe therapeutic adjustments (e.g., Pyridostigmine dose change, Prednisone taper), clinical assessment results, or instructions given to patient..."
            helperText="Comprehensive clinical intervention documentation"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={autoResolveAlert}
                onChange={(e) => setAutoResolveAlert(e.target.checked)}
                color="success"
              />
            }
            label={
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Automatically mark linked Alert as <strong>Resolved</strong> upon saving
              </Typography>
            }
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isLoading} color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isLoading}
            startIcon={<SaveIcon />}
            sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
          >
            {isLoading ? "Saving..." : "Record Intervention"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
