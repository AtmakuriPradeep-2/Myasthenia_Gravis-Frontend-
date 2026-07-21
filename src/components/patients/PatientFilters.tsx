import {
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Box,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sexFilter: string;
  onSexFilterChange: (value: string) => void;
  mgfaFilter: string;
  onMgfaFilterChange: (value: string) => void;
  onResetFilters: () => void;
}

export default function PatientFilters({
  searchQuery,
  onSearchChange,
  sexFilter,
  onSexFilterChange,
  mgfaFilter,
  onMgfaFilterChange,
  onResetFilters,
}: Props) {
  const hasActiveFilters = searchQuery !== "" || sexFilter !== "All" || mgfaFilter !== "All";

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
        {/* Search Query Input */}
        <Grid size={{ xs: 12, sm: 5, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search patient code or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748B", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* Biological Sex Filter */}
        <Grid size={{ xs: 6, sm: 3.5, md: 3 }}>
          <TextField
            select
            fullWidth
            label="Biological Sex"
            value={sexFilter}
            onChange={(e) => onSexFilterChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon sx={{ color: "#64748B", fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          >
            <MenuItem value="All">All Sexes</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Grid>

        {/* MGFA Classification Filter (Strictly 3 Model Trained Classes) */}
        <Grid size={{ xs: 6, sm: 3.5, md: 3 }}>
          <TextField
            select
            fullWidth
            label="MGFA Class"
            value={mgfaFilter}
            onChange={(e) => onMgfaFilterChange(e.target.value)}
          >
            <MenuItem value="All">All Classes</MenuItem>
            <MenuItem value="I">Class I (Ocular)</MenuItem>
            <MenuItem value="II">Class II (Mild)</MenuItem>
            <MenuItem value="III">Class III (Moderate)</MenuItem>
          </TextField>
        </Grid>

        {/* Reset Action Button */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
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
