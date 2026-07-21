import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import assessmentService from "../services/assessment.service";
import type { CreateAssessment } from "../types/assessment";

export const useAssessments = () =>
  useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.getAllAssessments(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const usePatientAssessments = (patientId: number | null) =>
  useQuery({
    queryKey: ["patient-assessments", patientId],
    queryFn: () => (patientId ? assessmentService.getPatientAssessments(patientId) : []),
    enabled: !!patientId,
  });

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssessment) => assessmentService.createAssessment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["patient-assessments", variables.patient_id] });
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
};
