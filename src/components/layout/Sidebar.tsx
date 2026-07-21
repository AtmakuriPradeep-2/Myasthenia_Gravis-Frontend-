import {
  Dashboard,
  People,
  Assessment,
  Psychology,
  Notifications,
  MedicalServices,
  Analytics,
  Person,
  Logout,
  LocalHospital,
} from "@mui/icons-material";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Avatar,
  Stack,
  Drawer,
} from "@mui/material";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserDisplayName, getUserInitial } from "../../utils/user";

// ─── Nav items with strict role access control ─────────────────────────
const ALL_MENU = [
  {
    title: "Dashboard",
    icon: <Dashboard />,
    path: "/",
    roles: ["Admin", "Clinician", "Researcher"],
  },
  {
    title: "Patients",
    icon: <People />,
    path: "/patients",
    roles: ["Clinician"],
  },
  {
    title: "Assessments",
    icon: <Assessment />,
    path: "/assessments",
    roles: ["Clinician"],
  },
  {
    title: "Predictions",
    icon: <Psychology />,
    path: "/predictions",
    roles: ["Clinician"],
  },
  {
    title: "Alerts",
    icon: <Notifications />,
    path: "/alerts",
    roles: ["Clinician"],
  },
  {
    title: "Interventions",
    icon: <MedicalServices />,
    path: "/interventions",
    roles: ["Clinician"],
  },
  {
    title: "Analytics",
    icon: <Analytics />,
    path: "/analytics",
    roles: ["Admin", "Clinician", "Researcher"],
  },
];


const BOTTOM_MENU = [
  {
    title: "User Management",
    icon: <ManageAccountsRoundedIcon />,
    path: "/users",
    roles: ["Admin"],
  },
  {
    title: "Profile",
    icon: <Person />,
    path: "/profile",
    roles: ["Admin", "Clinician", "Researcher"],
  },
];

const ROLE_BADGE_COLOR: Record<string, string> = {
  Admin: "#EF4444",
  Clinician: "#60A5FA",
  Researcher: "#A78BFA",
};

interface SidebarProps {
  mobileOpen?: boolean;
  onDrawerToggle?: () => void;
}

export default function Sidebar({ mobileOpen = false, onDrawerToggle }: SidebarProps) {
  const { logout, user } = useAuth();
  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);
  const role = user?.role ?? "Clinician";

  const handleItemClick = () => {
    if (mobileOpen && onDrawerToggle) {
      onDrawerToggle();
    }
  };

  // Filter nav items based on user's role
  const visibleMain = ALL_MENU.filter((item) => item.roles.includes(role));
  const visibleBottom = BOTTOM_MENU.filter((item) => item.roles.includes(role));

  const NavItem = ({ item }: { item: typeof ALL_MENU[0] }) => (
    <ListItemButton
      key={item.title}
      component={NavLink}
      to={item.path}
      end={item.path === "/"}
      onClick={handleItemClick}
      sx={{
        borderRadius: 3,
        px: 2,
        py: 1.25,
        color: "#94A3B8",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          color: "#FFFFFF",
          bgcolor: "rgba(255,255,255,0.06)",
          transform: "translateX(4px)",
        },
        "&.active": {
          color: "#FFFFFF",
          bgcolor: "#2563EB",
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
          "& .MuiListItemIcon-root": { color: "#FFFFFF" },
        },
      }}
    >
      <ListItemIcon sx={{ color: "#64748B", minWidth: 38, transition: "color 0.2s ease" }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        slotProps={{ primary: { sx: { fontSize: "0.9rem", fontWeight: 600 } } }}
      />
    </ListItemButton>
  );

  const sidebarContent = (
    <Box
      sx={{
        width: 270,
        bgcolor: "#0F172A",
        color: "#F8FAFC",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "#2563EB", width: 44, height: 44, boxShadow: "0 4px 14px rgba(37,99,235,0.4)" }}>
          <LocalHospital sx={{ color: "#FFFFFF" }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em", color: "#FFFFFF", lineHeight: 1.2 }}>
            MG AI Platform
          </Typography>
          <Chip label="Clinical v2.4" size="small"
            sx={{ mt: 0.5, height: 18, fontSize: "0.65rem", fontWeight: 700, bgcolor: "rgba(37,99,235,0.2)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.3)" }} />
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 2, mb: 2 }} />

      {/* Main Navigation */}
      <Box sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
        <Typography variant="caption"
          sx={{ px: 1.5, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", mb: 1 }}>
          Navigation
        </Typography>
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {visibleMain.map((item) => <NavItem key={item.path} item={item} />)}
        </List>

        {visibleBottom.length > 0 && (
          <>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 2 }} />
            <Typography variant="caption"
              sx={{ px: 1.5, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", mb: 1 }}>
              {role === "Admin" ? "Administration" : "Account"}
            </Typography>
            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {visibleBottom.map((item) => <NavItem key={item.path} item={item} />)}
            </List>
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 2, my: 1.5 }} />

      {/* User Info & Logout Footer */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ alignItems: "center", mb: 1.5, px: 1 }} spacing={1.5}>
          <Avatar
            sx={{
              bgcolor: "#1E293B",
              color: ROLE_BADGE_COLOR[role] ?? "#60A5FA",
              width: 36, height: 36, fontWeight: 700, fontSize: 14,
              border: `1px solid ${ROLE_BADGE_COLOR[role] ?? "#60A5FA"}55`,
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ overflow: "hidden", flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: ROLE_BADGE_COLOR[role] ?? "#64748B", fontWeight: 600, display: "block" }}>
              {role}
            </Typography>
          </Box>
        </Stack>

        <ListItemButton
          onClick={() => { logout(); handleItemClick(); }}
          sx={{
            borderRadius: 3, px: 2, py: 1, color: "#EF4444", transition: "all 0.2s ease",
            "&:hover": { bgcolor: "rgba(239,68,68,0.12)", color: "#F87171" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout Session"
            slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: 600 } } }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Temporary Drawer (< 900px) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { width: 270, bgcolor: "#0F172A", boxShadow: "4px 0 24px rgba(15,23,42,0.3)", border: "none" } } }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Fixed Pinned Sidebar (>= 900px) */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          width: 270,
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          height: "100vh",
          bgcolor: "#0F172A",
          boxShadow: "4px 0 24px rgba(15,23,42,0.15)",
          zIndex: 1200,
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
}