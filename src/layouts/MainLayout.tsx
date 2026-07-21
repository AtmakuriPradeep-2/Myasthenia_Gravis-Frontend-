import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC", width: "100%" }}>
      {/* Permanent Fixed Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: "100vh",
          ml: { xs: 0, md: "270px" },
          width: { xs: "100%", md: "calc(100% - 270px)" },
          overflowX: "hidden",
        }}
      >
        {/* Top Navigation Bar */}
        <Navbar onDrawerToggle={handleDrawerToggle} />

        {/* Page Main Content Container */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1600,
            width: "100%",
            mx: "auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
