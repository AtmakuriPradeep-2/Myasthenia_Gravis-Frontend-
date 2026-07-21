import {
  Card,
  Typography,
  Avatar,
  Stack,
  Box,
} from "@mui/material";

interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 28px ${color}22`,
          borderColor: `${color}60`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          bgcolor: color,
        },
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#0F172A",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mt: 0.5,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              display: "block",
              mt: 0.75,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: 52,
            height: 52,
            borderRadius: 3,
            border: `1px solid ${color}30`,
            boxShadow: `0 4px 12px ${color}20`,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Card>
  );
}