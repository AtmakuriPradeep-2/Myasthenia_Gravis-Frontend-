import { Paper, Typography, Button, Box, Chip, Stack } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

interface Props {
  dateRangeLabel: string;
  onExportCSV: () => void;
}

export default function AnalyticsHeader({ dateRangeLabel, onExportCSV }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5, md: 4 },
        borderRadius: { xs: 4, md: 5 },
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        color: "#FFFFFF",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
        mb: 2.5,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2.5}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
      >
        <Box sx={{ width: "100%" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<AnalyticsRoundedIcon sx={{ color: "#60A5FA !important", fontSize: "14px !important" }} />}
              label="Risk & Clinical Analytics"
              size="small"
              sx={{
                bgcolor: "rgba(37, 99, 235, 0.2)",
                color: "#93C5FD",
                fontWeight: 700,
                border: "1px solid rgba(147, 197, 253, 0.3)",
                fontSize: "0.7rem",
              }}
            />
            <Chip
              icon={<CalendarMonthRoundedIcon sx={{ color: "#34D399 !important", fontSize: "14px !important" }} />}
              label={dateRangeLabel}
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.2)",
                color: "#6EE7B7",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Exacerbation Risk Trend Intelligence
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              mt: 0.5,
              fontSize: { xs: "0.85rem", sm: "0.875rem" },
              maxWidth: 640,
            }}
          >
            Longitudinal trend modeling, risk stratification distribution, and clinical score correlation across custom observation windows.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<DownloadRoundedIcon />}
          onClick={onExportCSV}
          sx={{
            height: { xs: 44, sm: 48 },
            px: 3,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "0.875rem",
            width: { xs: "100%", sm: "auto" },
            whiteSpace: "nowrap",
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            boxShadow: "0 4px 16px rgba(37, 99, 235, 0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
            },
          }}
        >
          Export Report (CSV)
        </Button>
      </Stack>
    </Paper>
  );
}
