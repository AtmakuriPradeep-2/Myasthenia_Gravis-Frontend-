import { useMemo, useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import AssessmentHeader from "../../components/assessments/AssessmentHeader";
import AssessmentFilters from "../../components/assessments/AssessmentFilters";
import AssessmentTable from "../../components/assessments/AssessmentTable";
import AssessmentDialog from "../../components/assessments/AssessmentDialog";
import AssessmentTrendChart from "../../components/assessments/AssessmentTrendChart";

import { useAssessments, useCreateAssessment } from "../../hooks/useAssessments";
import { usePatients } from "../../hooks/usePatients";
import { useGeneratePrediction } from "../../hooks/usePredictions";

import type { Assessment } from "../../types/assessment";
import type { Patient } from "../../types/patient";

export default function AssessmentsPage() {
  // Query & Mutation Hooks
  const { data: rawAssessments, isLoading: isAssessmentsLoading, isError } = useAssessments();
  const { data: rawPatients } = usePatients();
  const createAssessmentMutation = useCreateAssessment();
  const generatePredictionMutation = useGeneratePrediction();

  const assessmentsList: Assessment[] = rawAssessments ?? [];
  const patientsList: Patient[] = rawPatients ?? [];

  // URL search params logic
  const [searchParams, setSearchParams] = useSearchParams();
  const patientIdParam = searchParams.get("patientId");

  // Filter States
  const [selectedPatientId, setSelectedPatientId] = useState("All");
  const [treatmentFilter, setTreatmentFilter] = useState("All");
  const [infectionFilter, setInfectionFilter] = useState("All");

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (patientIdParam) {
      setSelectedPatientId(patientIdParam);
      // Clear URL params
      setSearchParams({}, { replace: true });
    }
  }, [patientIdParam, setSearchParams]);

  // Client-side filtering logic
  const filteredAssessments = useMemo(() => {
    return assessmentsList.filter((item) => {
      // Patient filter
      const matchesPatient =
        selectedPatientId === "All" || item.patient_id === Number(selectedPatientId);

      // Treatment change filter
      const matchesTreatment =
        treatmentFilter === "All" || item.treatment_change === Number(treatmentFilter);

      // Infection flag filter
      const matchesInfection =
        infectionFilter === "All" || item.infection_event === Number(infectionFilter);

      return matchesPatient && matchesTreatment && matchesInfection;
    });
  }, [assessmentsList, selectedPatientId, treatmentFilter, infectionFilter]);

  const selectedPatientObj = useMemo(() => {
    if (selectedPatientId === "All") return undefined;
    return patientsList.find((p) => p.id === Number(selectedPatientId));
  }, [patientsList, selectedPatientId]);

  const handleResetFilters = () => {
    setSelectedPatientId("All");
    setTreatmentFilter("All");
    setInfectionFilter("All");
  };

  const handleCreateSubmit = async (formData: {
    patient_id: number;
    qmg_score: number;
    mgc_score: number;
    cfq_total: number;
    treatment_change: number;
    infection_event: number;
  }) => {
    try {
      await createAssessmentMutation.mutateAsync(formData);
      toast.success("Clinical assessment successfully recorded!");

      // Count patient existing observations
      const count = assessmentsList.filter((a) => a.patient_id === formData.patient_id).length + 1;
      if (count >= 2) {
        try {
          await generatePredictionMutation.mutateAsync(formData.patient_id);
          toast.success("Automated ML risk classification executed!");
        } catch (predErr) {
          console.warn("Auto-prediction trigger deferred:", predErr);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to record assessment.");
      throw err;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Hero Header */}
      <AssessmentHeader
        totalAssessments={assessmentsList.length}
        onRecordAssessment={() => setIsDialogOpen(true)}
      />

      {/* Backend API Error Alert if server down */}
      {isError && (
        <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 600, mb: 1 }}>
          Unable to fetch clinical assessments. Please verify backend service connection.
        </Alert>
      )}

      {/* Filter Bar */}
      <AssessmentFilters
        patients={patientsList}
        selectedPatientId={selectedPatientId}
        onPatientChange={setSelectedPatientId}
        treatmentFilter={treatmentFilter}
        onTreatmentChange={setTreatmentFilter}
        infectionFilter={infectionFilter}
        onInfectionChange={setInfectionFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Score Trajectory Trend Chart */}
      <AssessmentTrendChart
        assessments={filteredAssessments}
        patientCode={selectedPatientObj?.patient_code}
      />

      {/* Clinical Assessment Table */}
      <AssessmentTable
        assessments={filteredAssessments}
        patients={patientsList}
        isLoading={isAssessmentsLoading}
      />

      {/* Assessment Intake Modal */}
      <AssessmentDialog
        open={isDialogOpen}
        patients={patientsList}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createAssessmentMutation.isPending}
      />
    </Box>
  );
}
