import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import alertService from "../services/alert.service";
import type { AlertUpdate } from "../types/alert";

export const useAlerts = () =>
  useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertService.getAlerts(),
    staleTime: 1000 * 30, // 30 seconds
  });

export const useOpenAlerts = () =>
  useQuery({
    queryKey: ["alerts-open"],
    queryFn: () => alertService.getOpenAlerts(),
    staleTime: 1000 * 30,
  });

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AlertUpdate }) =>
      alertService.updateAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alerts-open"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
};
