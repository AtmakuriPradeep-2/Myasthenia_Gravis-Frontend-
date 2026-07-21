import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import interventionService from "../services/intervention.service";
import type { CreateIntervention } from "../types/intervention";

export const useInterventions = () =>
  useQuery({
    queryKey: ["interventions"],
    queryFn: () => interventionService.getInterventions(),
    staleTime: 1000 * 60, // 1 minute
  });

export const usePatientInterventions = (patientId: number | null) =>
  useQuery({
    queryKey: ["patient-interventions", patientId],
    queryFn: () => (patientId ? interventionService.getPatientInterventions(patientId) : []),
    enabled: !!patientId,
  });

export const useCreateIntervention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIntervention) => interventionService.createIntervention(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
      queryClient.invalidateQueries({ queryKey: ["patient-interventions", variables.patient_id] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alerts-open"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
};
