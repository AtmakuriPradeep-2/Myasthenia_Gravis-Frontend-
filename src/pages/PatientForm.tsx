import { useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Stack,
  InputAdornment,
  Chip,
} from "@mui/material";
import toast from "react-hot-toast";

import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

import { useCreatePatient } from "../hooks/usePatients";

export default function PatientForm() {
  const { mutateAsync, isPending } = useCreatePatient();

  const [form, setForm] = useState({
    patient_code: "",
    age: "",
    sex: "Male",
    mgfa_class: "I",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.patient_code.trim()) {
      toast.error("Please enter a valid Patient Code");
      return;
    }

    if (!form.age || Number(form.age) <= 0) {
      toast.error("Please enter a valid age");
      return;
    }

    try {
      await mutateAsync({
        patient_code: form.patient_code.trim(),
        age: Number(form.age),
        sex: form.sex,
        mgfa_class: form.mgfa_class,
      });

      toast.success("Patient registered successfully!");
      setForm({
        patient_code: "",
        age: "",
        sex: "Male",
        mgfa_class: "I",
      });
    } catch {
      toast.error("Unable to register patient. Check code uniqueness.");
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4.5 },
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(37, 99, 235, 0.1)",
          }}
        >
          <PersonAddAlt1RoundedIcon sx={{ color: "#2563EB", fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
            Patient Intake & Registration
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Register new MG patient into longitudinal monitoring cohort
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Patient Identification Code"
              placeholder="e.g. MG-1042"
              value={form.patient_code}
              onChange={(e) =>
                setForm({ ...form, patient_code: e.target.value })
              }
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Age (Years)"
              placeholder="e.g. 48"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Biological Sex"
              value={form.sex}
              onChange={(e) =>
                setForm({ ...form, sex: e.target.value })
              }
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="MGFA Clinical Classification"
              value={form.mgfa_class}
              onChange={(e) =>
                setForm({ ...form, mgfa_class: e.target.value })
              }
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
              <MenuItem value="I">Class I - Ocular Weakness Only</MenuItem>
              <MenuItem value="II">Class II - Mild Generalized Weakness</MenuItem>
              <MenuItem value="III">Class III - Moderate Generalized Weakness</MenuItem>
              <MenuItem value="IV">Class IV - Severe Generalized Weakness</MenuItem>
              <MenuItem value="V">Class V - Intubation Required</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 3, border: "1px solid #F1F5F9" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                Selected MGFA Severity Level Guidance
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Chip
                  label={`MGFA Class ${form.mgfa_class}`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                <Typography variant="caption" sx={{ color: "#475569" }}>
                  Baseline classification used for ML risk forecasting algorithm.
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending}
              sx={{
                height: 48,
                borderRadius: 3,
                px: 4,
                fontWeight: 700,
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              }}
            >
              {isPending ? "Registering Patient..." : "Complete Registration"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}