import { useMemo, useState } from "react";
import { Box, Alert } from "@mui/material";
import toast from "react-hot-toast";

import PatientHeader from "../../components/patients/PatientHeader";
import PatientFilters from "../../components/patients/PatientFilters";
import PatientTable from "../../components/patients/PatientTable";
import PatientDialog from "../../components/patients/PatientDialog";
import DeletePatientDialog from "../../components/patients/DeletePatientDialog";
import PatientDetailDrawer from "../../components/patients/PatientDetailDrawer";

import {
  usePatients,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
} from "../../hooks/usePatients";

import type { Patient } from "../../types/patient";

export default function PatientsPage() {
  // Query & Mutation Hooks
  const { data: rawPatients, isLoading, isError } = usePatients();
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeletePatient();

  const patientsList: Patient[] = rawPatients ?? [];

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sexFilter, setSexFilter] = useState("All");
  const [mgfaFilter, setMgfaFilter] = useState("All");

  // Dialog & Drawer States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);

  // Client-Side Search & Filter Logic
  const filteredPatients = useMemo(() => {
    return patientsList.filter((patient) => {
      // Search query check
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        patient.patient_code.toLowerCase().includes(query) ||
        String(patient.id).includes(query);

      // Sex filter check
      const matchesSex = sexFilter === "All" || patient.sex === sexFilter;

      // MGFA Class filter check
      const matchesMgfa = mgfaFilter === "All" || patient.mgfa_class === mgfaFilter;

      return matchesQuery && matchesSex && matchesMgfa;
    });
  }, [patientsList, searchQuery, sexFilter, mgfaFilter]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setSexFilter("All");
    setMgfaFilter("All");
  };

  // Open Handlers
  const handleOpenAddDialog = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  const handleOpenEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (patient: Patient) => {
    setDeletingPatient(patient);
    setIsDeleteOpen(true);
  };

  const handleOpenDetailDrawer = (patient: Patient) => {
    setDetailPatient(patient);
    setIsDrawerOpen(true);
  };

  // Form Submit (Create or Update)
  const handleFormSubmit = async (formData: {
    patient_code: string;
    age: number;
    sex: string;
    mgfa_class: string;
  }) => {
    if (editingPatient) {
      // Update
      try {
        await updatePatientMutation.mutateAsync({
          id: editingPatient.id,
          data: formData,
        });
        toast.success(`Patient ${formData.patient_code} updated!`);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Failed to update patient.");
        throw err;
      }
    } else {
      // Create
      try {
        await createPatientMutation.mutateAsync(formData);
        toast.success(`Patient ${formData.patient_code} registered!`);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Patient registration failed.");
        throw err;
      }
    }
  };

  // Delete Confirm
  const handleConfirmDelete = async (patientId: number) => {
    try {
      await deletePatientMutation.mutateAsync(patientId);
      toast.success("Patient record deleted.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to delete patient.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Hero Header */}
      <PatientHeader
        totalPatients={patientsList.length}
        onAddPatient={handleOpenAddDialog}
      />

      {/* Backend fetch error alert if server is down */}
      {isError && (
        <Alert
          severity="error"
          sx={{ borderRadius: 3, fontWeight: 600, mb: 1 }}
        >
          Unable to fetch patient records from backend. Please ensure the backend server is running.
        </Alert>
      )}

      {/* Filter Controls */}
      <PatientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sexFilter={sexFilter}
        onSexFilterChange={setSexFilter}
        mgfaFilter={mgfaFilter}
        onMgfaFilterChange={setMgfaFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Patients Data Table */}
      <PatientTable
        patients={filteredPatients}
        isLoading={isLoading}
        onViewDetails={handleOpenDetailDrawer}
        onEditPatient={handleOpenEditDialog}
        onDeletePatient={handleOpenDeleteDialog}
      />

      {/* Create / Edit Form Modal */}
      <PatientDialog
        open={isFormOpen}
        patient={editingPatient}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createPatientMutation.isPending || updatePatientMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeletePatientDialog
        open={isDeleteOpen}
        patient={deletingPatient}
        onClose={() => setIsDeleteOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        isLoading={deletePatientMutation.isPending}
      />

      {/* Detail Slide-out Drawer */}
      <PatientDetailDrawer
        open={isDrawerOpen}
        patient={detailPatient}
        onClose={() => setIsDrawerOpen(false)}
      />
    </Box>
  );
}
