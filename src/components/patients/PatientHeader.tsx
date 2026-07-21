import { Paper, Typography, Button, Box, Chip, Stack } from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

interface Props {
  totalPatients: number;
  onAddPatient: () => void;
}

export default function PatientHeader({ totalPatients, onAddPatient }: Props) {
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
              icon={<GroupsRoundedIcon sx={{ color: "#60A5FA !important", fontSize: "14px !important" }} />}
              label="Cohort Registry"
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
              label={`${totalPatients} Active Records`}
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
            Myasthenia Gravis Patient Directory
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              mt: 0.5,
              fontSize: { xs: "0.85rem", sm: "0.875rem" },
              maxWidth: 600,
            }}
          >
            Manage longitudinal patient profiles, biological parameters, and baseline MGFA clinical classifications.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1RoundedIcon />}
          onClick={onAddPatient}
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
          Register New Patient
        </Button>
      </Stack>
    </Paper>
  );
}
