import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import type { Patient } from "../../types/patient";

interface Props {
  open: boolean;
  patients: Patient[];
  onClose: () => void;
  onSubmit: (patientId: number) => Promise<any>;
  isLoading: boolean;
}

export default function RunPredictionDialog({
  open,
  patients,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [patientId, setPatientId] = useState<number | "">("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!patientId || Number(patientId) <= 0) {
      setErrorMsg("Please select a valid patient candidate.");
      return;
    }

    try {
      await onSubmit(Number(patientId));
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Prediction failed. Ensure patient has at least 2 longitudinal assessments.");
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
            Execute Machine Learning Inference
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Gradient Boosting Calibrated Risk Assessment Engine
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

          <Typography variant="body2" sx={{ color: "#475569", mb: 2.5 }}>
            Select candidate from longitudinal cohort. The ML model requires at least <strong>2 clinical assessments</strong> (QMG/MGC scores) to calculate trend deltas and rolling averages.
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Patient for Risk Analysis"
            value={patientId}
            onChange={(e) => setPatientId(Number(e.target.value))}
            helperText="Requires 2+ QMG/MGC longitudinal observations"
          >
            {patients.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.patient_code} (ID: #{p.id} - Class {p.mgfa_class}, Age {p.age})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={<AutoAwesomeIcon />}
            sx={{
              borderRadius: 3,
              px: 3,
              fontWeight: 700,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            }}
          >
            {isLoading ? "Analyzing Patient..." : "Execute Prediction"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
