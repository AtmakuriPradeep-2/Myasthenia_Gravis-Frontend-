import { useEffect, useState } from "react";
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
  InputAdornment,
  Alert,
  Slider,
  Chip,
  Paper,
  Stack,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import type { Patient } from "../../types/patient";

interface Props {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSubmit: (formData: { patient_code: string; age: number; sex: string; mgfa_class: string }) => Promise<void>;
  isLoading: boolean;
}

// Derive MGFA Disease Classification strictly matching trained ML model dataset (Classes I, II, III)
const deriveMgfaClass = (qmg: number, mgc: number, cfq: number): string => {
  const fatigueBonus = cfq >= 20 ? 2 : cfq >= 15 ? 1 : 0;
  const compositeScore = Math.max(qmg, mgc) + fatigueBonus;

  if (compositeScore <= 8) return "I";
  if (compositeScore <= 15) return "II";
  return "III";
};

const getMgfaLabel = (mgfaClass: string): string => {
  switch (mgfaClass) {
    case "I":
      return "Class I (Ocular - Mild)";
    case "II":
      return "Class II (Mild Generalised)";
    case "III":
      return "Class III (Moderate Generalised)";
    default:
      return `Class ${mgfaClass}`;
  }
};

export default function PatientDialog({
  open,
  patient,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const isEdit = !!patient;

  const [qmgScore, setQmgScore] = useState<number>(10);
  const [mgcScore, setMgcScore] = useState<number>(8);
  const [cfqScore, setCfqScore] = useState<number>(14);

  const [form, setForm] = useState({
    patient_code: "",
    age: "",
    sex: "Male",
    mgfa_class: "II",
  });

  const [autoDerived, setAutoDerived] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (patient) {
      setForm({
        patient_code: patient.patient_code,
        age: String(patient.age),
        sex: patient.sex,
        mgfa_class: patient.mgfa_class,
      });
      setAutoDerived(false);
    } else {
      setForm({
        patient_code: "",
        age: "",
        sex: "Male",
        mgfa_class: deriveMgfaClass(qmgScore, mgcScore, cfqScore),
      });
      setAutoDerived(true);
    }
    setErrorMsg("");
  }, [patient, open]);

  const handleScoreChange = (qmg: number, mgc: number, cfq: number) => {
    setQmgScore(qmg);
    setMgcScore(mgc);
    setCfqScore(cfq);

    if (autoDerived && !isEdit) {
      const derived = deriveMgfaClass(qmg, mgc, cfq);
      setForm((prev) => ({ ...prev, mgfa_class: derived }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.patient_code.trim()) {
      setErrorMsg("Please enter a valid Patient Identification Code.");
      return;
    }

    if (!form.age || Number(form.age) <= 0) {
      setErrorMsg("Please enter a valid positive age.");
      return;
    }

    try {
      await onSubmit({
        patient_code: form.patient_code.trim(),
        age: Number(form.age),
        sex: form.sex,
        mgfa_class: form.mgfa_class,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Operation failed. Check patient code uniqueness.");
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
            {isEdit ? "Edit Patient Record" : "Register New Patient"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {isEdit ? `Updating details for ID: ${patient?.id}` : "Predict MGFA disease class (Trained Model: Classes I, II, III)"}
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

          <Grid container spacing={2.5}>
            {/* Patient Code & Age */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Patient Code"
                placeholder="e.g. MG-1042"
                value={form.patient_code}
                onChange={(e) => setForm({ ...form, patient_code: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Age (Years)"
                placeholder="e.g. 52"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Biological Sex */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Biological Sex"
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>

            {/* MGFA Classification Field (Strictly Classes I, II, III matching trained model) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="MGFA Classification (Model Trained Classes)"
                value={form.mgfa_class}
                onChange={(e) => {
                  setForm({ ...form, mgfa_class: e.target.value });
                  setAutoDerived(false);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospitalOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                <MenuItem value="I">Class I - Ocular</MenuItem>
                <MenuItem value="II">Class II - Mild</MenuItem>
                <MenuItem value="III">Class III - Moderate</MenuItem>
              </TextField>
            </Grid>

            {/* Score-Based MGFA Auto-Determination Box */}
            {!isEdit && (
              <Grid size={{ xs: 12 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    border: "1px solid #E2E8F0",
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      icon={<AutoAwesomeIcon sx={{ color: "#2563EB !important", fontSize: "14px !important" }} />}
                      label="Trained Model Score-Based Disease Class"
                      size="small"
                      sx={{ bgcolor: "rgba(37, 99, 235, 0.1)", color: "#2563EB", fontWeight: 700 }}
                    />
                    <Chip
                      label={getMgfaLabel(form.mgfa_class)}
                      size="small"
                      sx={{ bgcolor: "#2563EB", color: "#FFFFFF", fontWeight: 800 }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
                    Adjust baseline QMG (0-39), MGC (0-50), and CFQ Fatigue (0-28) scores to derive disease class:
                  </Typography>

                  <Stack spacing={2}>
                    {/* Baseline QMG Slider */}
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                          Quantitative MG (QMG): <strong>{qmgScore} pts</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>0 - 39</Typography>
                      </Box>
                      <Slider
                        value={qmgScore}
                        min={0}
                        max={39}
                        step={1}
                        onChange={(_, val) => handleScoreChange(val as number, mgcScore, cfqScore)}
                        sx={{ color: "#2563EB" }}
                      />
                    </Box>

                    {/* Baseline MGC Slider */}
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                          MG Composite (MGC): <strong>{mgcScore} pts</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>0 - 50</Typography>
                      </Box>
                      <Slider
                        value={mgcScore}
                        min={0}
                        max={50}
                        step={1}
                        onChange={(_, val) => handleScoreChange(qmgScore, val as number, cfqScore)}
                        sx={{ color: "#9333EA" }}
                      />
                    </Box>

                    {/* Baseline CFQ Total Slider */}
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                          Clinical Fatigue Questionnaire (CFQ Total): <strong>{cfqScore} pts</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>0 - 28</Typography>
                      </Box>
                      <Slider
                        value={cfqScore}
                        min={0}
                        max={28}
                        step={1}
                        onChange={(_, val) => handleScoreChange(qmgScore, mgcScore, val as number)}
                        sx={{ color: "#D97706" }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}
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
            {isLoading ? "Saving Record..." : isEdit ? "Save Changes" : "Register Patient"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
