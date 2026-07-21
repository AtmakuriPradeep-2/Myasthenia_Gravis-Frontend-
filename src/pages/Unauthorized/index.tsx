import { Box, Typography, Button, Paper, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useAuth } from "../../contexts/AuthContext";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 30%, #1E3A8A 0%, #0F172A 70%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 4, sm: 6 },
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: "rgba(239,68,68,0.1)",
            mx: "auto",
            mb: 3,
          }}
        >
          <BlockRoundedIcon sx={{ fontSize: 40, color: "#EF4444" }} />
        </Avatar>

        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Access Denied
        </Typography>

        <Typography variant="body1" sx={{ color: "#64748B", mt: 1.5, mb: 1 }}>
          You don't have permission to view this page.
        </Typography>

        {user && (
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Your current role is{" "}
            <strong style={{ color: "#2563EB" }}>{user.role}</strong>.
          </Typography>
        )}

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "#FEF2F2",
            borderRadius: 3,
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#DC2626", fontWeight: 600 }}>
            If you believe this is a mistake, contact your system administrator to request access.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/")}
          sx={{
            mt: 4,
            height: 48,
            px: 4,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
          }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
