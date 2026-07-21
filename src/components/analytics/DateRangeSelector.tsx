import {
  Paper,
  TextField,
  Chip,
  Grid,
  Box,
  Typography,
  Stack,
  InputAdornment,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export type DatePreset = "7d" | "30d" | "90d" | "1y" | "all" | "custom";

interface Props {
  preset: DatePreset;
  startDate: string;
  endDate: string;
  onSelectPreset: (preset: DatePreset) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangeSelector({
  preset,
  startDate,
  endDate,
  onSelectPreset,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  const presets: { id: DatePreset; label: string }[] = [
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
    { id: "1y", label: "Last 1 Year" },
    { id: "all", label: "All Time" },
  ];

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
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        {/* Preset Chips */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "block" }}>
              Quick Period Presets
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {presets.map((p) => {
                const isActive = preset === p.id;
                return (
                  <Chip
                    key={p.id}
                    label={p.label}
                    onClick={() => onSelectPreset(p.id)}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      bgcolor: isActive ? "#2563EB" : "#F1F5F9",
                      color: isActive ? "#FFFFFF" : "#475569",
                      border: isActive ? "1px solid #1D4ED8" : "1px solid #E2E8F0",
                      "&:hover": {
                        bgcolor: isActive ? "#1D4ED8" : "#E2E8F0",
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* Custom Start & End Date Pickers */}
        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => {
              onStartDateChange(e.target.value);
              onSelectPreset("custom");
            }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: "#64748B", fontSize: 16 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => {
              onEndDateChange(e.target.value);
              onSelectPreset("custom");
            }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon sx={{ color: "#64748B", fontSize: 16 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
