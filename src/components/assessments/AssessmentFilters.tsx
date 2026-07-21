import {
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Box,
} from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import type { Patient } from "../../types/patient";

interface Props {
  patients: Patient[];
  selectedPatientId: string;
  onPatientChange: (value: string) => void;
  treatmentFilter: string;
  onTreatmentChange: (value: string) => void;
  infectionFilter: string;
  onInfectionChange: (value: string) => void;
  onResetFilters: () => void;
}

export default function AssessmentFilters({
  patients,
  selectedPatientId,
  onPatientChange,
  treatmentFilter,
  onTreatmentChange,
  infectionFilter,
  onInfectionChange,
  onResetFilters,
}: Props) {
  const hasActiveFilters = selectedPatientId !== "All" || treatmentFilter !== "All" || infectionFilter !== "All";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.03)",
        mb: 2.5,
      }}
    >
      <Grid container spacing={1.5} sx={{ alignItems: "center" }}>
        {/* Patient Selection Filter */}
        <Grid size={{ xs: 12, sm: 5, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Filter by Patient"
            value={selectedPatientId}
            onChange={(e) => onPatientChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListRoundedIcon sx={{ color: "#64748B", fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          >
            <MenuItem value="All">All Patients Cohort</MenuItem>
            {patients.map((p) => (
              <MenuItem key={p.id} value={String(p.id)}>
                {p.patient_code} (ID: #{p.id} - Class {p.mgfa_class})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Treatment Change Filter */}
        <Grid size={{ xs: 6, sm: 3.5, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Treatment Change"
            value={treatmentFilter}
            onChange={(e) => onTreatmentChange(e.target.value)}
          >
            <MenuItem value="All">All Regimens</MenuItem>
            <MenuItem value="1">Regimen Adjusted (Yes)</MenuItem>
            <MenuItem value="0">No Change (No)</MenuItem>
          </TextField>
        </Grid>

        {/* Infection Event Filter */}
        <Grid size={{ xs: 6, sm: 3.5, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Infection Flag"
            value={infectionFilter}
            onChange={(e) => onInfectionChange(e.target.value)}
          >
            <MenuItem value="All">All Events</MenuItem>
            <MenuItem value="1">Infection Reported (Yes)</MenuItem>
            <MenuItem value="0">No Infection (No)</MenuItem>
          </TextField>
        </Grid>

        {/* Reset Action */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button
              variant="outlined"
              startIcon={<RestartAltRoundedIcon />}
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              sx={{
                height: 48,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#CBD5E1",
                color: "#475569",
                width: "100%",
              }}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
