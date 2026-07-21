import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Assessments from "./pages/Assessments";
import Predictions from "./pages/Predictions";
import Alerts from "./pages/Alerts";
import Interventions from "./pages/Interventions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import UnauthorizedPage from "./pages/Unauthorized";

import MainLayout from "./layouts/MainLayout";
import RoleGuardedRoute from "./routes/RoleGuardedRoute";
import ScrollToTop from "./components/layout/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* ─── Public ─── */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ─── Shared Access (Admin, Clinician, Researcher) ─── */}
      <Route
        path="/"
        element={
          <RoleGuardedRoute allowedRoles={["Admin", "Clinician", "Researcher"]}>
            <MainLayout><Dashboard /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <RoleGuardedRoute allowedRoles={["Admin", "Clinician", "Researcher"]}>
            <MainLayout><Analytics /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <RoleGuardedRoute allowedRoles={["Admin", "Clinician", "Researcher"]}>
            <MainLayout><Profile /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      {/* ─── Clinician Only (Medical Care & AI Diagnostics) ─── */}
      <Route
        path="/patients"
        element={
          <RoleGuardedRoute allowedRoles={["Clinician"]}>
            <MainLayout><Patients /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      <Route
        path="/assessments"
        element={
          <RoleGuardedRoute allowedRoles={["Clinician"]}>
            <MainLayout><Assessments /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      <Route
        path="/predictions"
        element={
          <RoleGuardedRoute allowedRoles={["Clinician"]}>
            <MainLayout><Predictions /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <RoleGuardedRoute allowedRoles={["Clinician"]}>
            <MainLayout><Alerts /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      <Route
        path="/interventions"
        element={
          <RoleGuardedRoute allowedRoles={["Clinician"]}>
            <MainLayout><Interventions /></MainLayout>
          </RoleGuardedRoute>
        }
      />

      {/* ─── Admin Only (System Governance & User Management) ─── */}
      <Route
        path="/users"
        element={
          <RoleGuardedRoute allowedRoles={["Admin"]}>
            <MainLayout><UserManagement /></MainLayout>
          </RoleGuardedRoute>
        }
      />
    </Routes>
    </>
  );
}