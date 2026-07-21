import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Stack,
  Button,
  Paper,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

import type { Patient } from "../../types/patient";

interface Props {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
}

const getMgfaDescription = (mgfaClass: string) => {
  switch (mgfaClass?.toUpperCase()) {
    case "I":
      return "Ocular Muscle Weakness Only. Mild ptosis or diplopia without limb/respiratory involvement.";
    case "II":
      return "Mild Generalized Muscle Weakness. May involve limb, axial, or bulbar musculature.";
    case "III":
      return "Moderate Generalized Muscle Weakness. Significant limb weakness affecting daily mobility.";
    case "IV":
      return "Severe Generalized Muscle Weakness. Marked bulbar weakness; high exacerbation risk.";
    case "V":
      return "Crisis Stage - Intubation & Mechanical Ventilation required for airway preservation.";
    default:
      return "Baseline clinical assessment classification.";
  }
};

export default function PatientDetailDrawer({ open, patient, onClose }: Props) {
  if (!patient) return null;

  const desc = getMgfaDescription(patient.mgfa_class);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 460 },
            p: 3,
            bgcolor: "#F8FAFC",
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 44,
              height: 44,
              fontWeight: 800,
            }}
          >
            <PersonRoundedIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
              {patient.patient_code}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Patient Database Record ID: #{patient.id}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Patient Key Metrics */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2, display: "block" }}>
          Clinical Demographics
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
              Biological Sex
            </Typography>
            <Chip
              label={patient.sex}
              size="small"
              sx={{
                bgcolor: patient.sex === "Male" ? "#EFF6FF" : "#FDF2F8",
                color: patient.sex === "Male" ? "#2563EB" : "#DB2777",
                fontWeight: 700,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
              Age
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>
              {patient.age} Years Old
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
              MGFA Severity Class
            </Typography>
            <Chip
              label={`Class ${patient.mgfa_class}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 800 }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* MGFA Severity Description */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
          <LocalHospitalRoundedIcon sx={{ color: "#2563EB", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
            MGFA Severity Profile
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
          {desc}
        </Typography>
      </Paper>

      {/* Direct Module Action Shortcuts */}
      <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5, display: "block" }}>
        Patient Care Shortcuts
      </Typography>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AssessmentRoundedIcon />}
          sx={{
            justifyContent: "flex-start",
            py: 1.25,
            borderRadius: 3,
            borderColor: "#CBD5E1",
            color: "#0F172A",
            fontWeight: 600,
          }}
        >
          View Assessment History
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<PsychologyRoundedIcon />}
          sx={{
            justifyContent: "flex-start",
            py: 1.25,
            borderRadius: 3,
            borderColor: "#CBD5E1",
            color: "#0F172A",
            fontWeight: 600,
          }}
        >
          Run AI Risk Prediction
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<MedicalServicesRoundedIcon />}
          sx={{
            justifyContent: "flex-start",
            py: 1.25,
            borderRadius: 3,
            borderColor: "#CBD5E1",
            color: "#0F172A",
            fontWeight: 600,
          }}
        >
          Record Care Intervention
        </Button>
      </Stack>
    </Drawer>
  );
}
