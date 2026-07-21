import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import patientService from "../services/patient.service";
import type { CreatePatient, UpdatePatientRequest } from "../types/patient";

export const usePatients = () =>
  useQuery({
    queryKey: ["patients"],
    queryFn: () => patientService.getPatients(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const usePatient = (id: number | null) =>
  useQuery({
    queryKey: ["patient", id],
    queryFn: () => (id ? patientService.getPatientById(id) : null),
    enabled: !!id,
  });

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatient) => patientService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["patient-statistics"] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePatientRequest }) =>
      patientService.updatePatient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", variables.id] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["patient-statistics"] });
    },
  });
};