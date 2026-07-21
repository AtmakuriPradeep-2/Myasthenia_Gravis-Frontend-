import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import predictionService from "../services/prediction.service";

export const usePredictions = () =>
  useQuery({
    queryKey: ["predictions"],
    queryFn: () => predictionService.getAllPredictions(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const usePatientPredictions = (patientId: number | null) =>
  useQuery({
    queryKey: ["patient-predictions", patientId],
    queryFn: () => (patientId ? predictionService.getPatientPredictions(patientId) : []),
    enabled: !!patientId,
  });

export const useGeneratePrediction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: number) => predictionService.generatePrediction(patientId),
    onSuccess: (_, patientId) => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      queryClient.invalidateQueries({ queryKey: ["patient-predictions", patientId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["risk-distribution"] });
    },
  });
};
