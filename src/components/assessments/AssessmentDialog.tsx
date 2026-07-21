import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { Patient } from "../../types/patient";

interface Props {
  open: boolean;
  patients: Patient[];
  onClose: () => void;
  onSubmit: (formData: {
    patient_id: number;
    qmg_score: number;
    mgc_score: number;
    cfq_total: number;
    treatment_change: number;
    infection_event: number;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function AssessmentDialog({
  open,
  patients,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [patientId, setPatientId] = useState<number | "">("");
  const [qmgScore, setQmgScore] = useState<number>(10);
  const [mgcScore, setMgcScore] = useState<number>(12);
  const [cfqTotal, setCfqTotal] = useState<number>(8);
  const [treatmentChange, setTreatmentChange] = useState<boolean>(false);
  const [infectionEvent, setInfectionEvent] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!patientId || Number(patientId) <= 0) {
      setErrorMsg("Please select a valid patient from the cohort registry.");
      return;
    }

    try {
      await onSubmit({
        patient_id: Number(patientId),
        qmg_score: Number(qmgScore),
        mgc_score: Number(mgcScore),
        cfq_total: Number(cfqTotal),
        treatment_change: treatmentChange ? 1 : 0,
        infection_event: infectionEvent ? 1 : 0,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Failed to log assessment.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          elevation: 5,
          sx: {
            borderRadius: 5,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
            Record Clinical Assessment
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Longitudinal score intake & clinical flag evaluation
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#94A3B8" }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3, borderColor: "#F1F5F9" }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Select Patient */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Select Patient"
                value={patientId}
                onChange={(e) => setPatientId(Number(e.target.value))}
                helperText="Select candidate from longitudinal cohort"
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.patient_code} (ID: #{p.id} - Class {p.mgfa_class}, Age {p.age})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* QMG Score Slider */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                  Quantitative MG (QMG) Score: <strong>{qmgScore} pts</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Range: 0 - 39</Typography>
              </Box>
              <Slider
                value={qmgScore}
                min={0}
                max={39}
                step={1}
                onChange={(_, val) => setQmgScore(val as number)}
                valueLabelDisplay="auto"
                sx={{ color: "#2563EB" }}
              />
            </Grid>

            {/* MGC Score Slider */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                  MG Composite (MGC) Score: <strong>{mgcScore} pts</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Range: 0 - 50</Typography>
              </Box>
              <Slider
                value={mgcScore}
                min={0}
                max={50}
                step={1}
                onChange={(_, val) => setMgcScore(val as number)}
                valueLabelDisplay="auto"
                sx={{ color: "#9333EA" }}
              />
            </Grid>

            {/* CFQ Total Slider */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                  Clinical Fatigue Questionnaire (CFQ): <strong>{cfqTotal} pts</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>Range: 0 - 28</Typography>
              </Box>
              <Slider
                value={cfqTotal}
                min={0}
                max={28}
                step={1}
                onChange={(_, val) => setCfqTotal(val as number)}
                valueLabelDisplay="auto"
                sx={{ color: "#D97706" }}
              />
            </Grid>

            {/* Clinical Flags */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={treatmentChange}
                    onChange={(e) => setTreatmentChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>
                    Treatment Regimen Adjusted
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={infectionEvent}
                    onChange={(e) => setInfectionEvent(e.target.checked)}
                    color="error"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>
                    Infection Event Reported
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: 3,
              px: 3,
              fontWeight: 700,
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            }}
          >
            {isLoading ? "Saving Record..." : "Submit Assessment"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
