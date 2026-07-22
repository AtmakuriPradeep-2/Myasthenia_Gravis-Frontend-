import { useState, useEffect } from "react";
import { Box, Grid, Alert, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import PredictionHeader from "../../components/predictions/PredictionHeader";
import PredictionCard from "../../components/predictions/PredictionCard";
import RunPredictionDialog from "../../components/predictions/RunPredictionDialog";
import PredictionTable from "../../components/predictions/PredictionTable";

import { usePredictions, useGeneratePrediction } from "../../hooks/usePredictions";
import { usePatients } from "../../hooks/usePatients";

import type { Prediction } from "../../types/prediction";
import type { Patient } from "../../types/patient";

import { exportPredictionsToCSV } from "../../utils/exportPredictions";

export default function PredictionsPage() {
  const { data: rawPredictions, isLoading: isPredictionsLoading, isError } = usePredictions();
  const { data: rawPatients } = usePatients();
  const generatePredictionMutation = useGeneratePrediction();

  const predictionsList: Prediction[] = rawPredictions ?? [];
  const patientsList: Patient[] = rawPatients ?? [];

  // URL search params logic
  const [searchParams, setSearchParams] = useSearchParams();
  const patientIdParam = searchParams.get("patientId");
  const runParam = searchParams.get("run");

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialPatientId, setInitialPatientId] = useState<number | "">("");

  // Latest prediction card result state
  const [latestInference, setLatestInference] = useState<any | null>(null);

  useEffect(() => {
    if (patientIdParam) {
      setInitialPatientId(Number(patientIdParam));
      if (runParam === "true") {
        setIsDialogOpen(true);
      }
      setSearchParams({}, { replace: true });
    }
  }, [patientIdParam, runParam, setSearchParams]);

  const handleRunPrediction = async (patientId: number) => {
    try {
      const result = await generatePredictionMutation.mutateAsync(patientId);
      setLatestInference(result);
      toast.success(`Risk analysis generated for Patient #${patientId}!`);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Prediction inference failed.";
      toast.error(msg);
      throw err;
    }
  };

  const handleExportCSV = () => {
    if (predictionsList.length === 0) {
      toast.error("No prediction records available to export.");
      return;
    }
    exportPredictionsToCSV(predictionsList, patientsList);
    toast.success("Exported predictions to CSV file!");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Hero Header */}
      <PredictionHeader
        totalPredictions={predictionsList.length}
        onRunPrediction={() => setIsDialogOpen(true)}
        onExportCSV={handleExportCSV}
      />


      {/* API Connection Error Notice */}
      {isError && (
        <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 600, mb: 1 }}>
          Unable to fetch prediction records. Please verify backend ML engine connection.
        </Alert>
      )}

      {/* Latest Inference Result Highlight Card if generated in session */}
      {latestInference && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", mb: 1.5 }}>
            Recent ML Risk Assessment Result
          </Typography>
          <PredictionCard prediction={latestInference} patients={patientsList} />
        </Box>
      )}

      {/* Historical Predictions Cards Grid (Latest 3) */}
      {predictionsList.length > 0 && !latestInference && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", mb: 1.5 }}>
            Recent Exacerbation Inferences
          </Typography>
          <Grid container spacing={2.5}>
            {predictionsList.slice(0, 3).map((pred) => (
              <Grid key={pred.id} size={{ xs: 12, md: 4 }}>
                <PredictionCard prediction={pred} patients={patientsList} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Prediction History Table */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1.5 }}>
          ML Prediction Audit Log
        </Typography>
        <PredictionTable
          predictions={predictionsList}
          patients={patientsList}
          isLoading={isPredictionsLoading}
        />
      </Box>

      {/* Trigger Prediction Dialog */}
      <RunPredictionDialog
        open={isDialogOpen}
        patients={patientsList}
        initialPatientId={initialPatientId}
        onClose={() => {
          setIsDialogOpen(false);
          setInitialPatientId("");
        }}
        onSubmit={handleRunPrediction}
        isLoading={generatePredictionMutation.isPending}
      />
    </Box>
  );
}
