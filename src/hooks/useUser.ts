import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../services/user.service";
import type { UserCreatePayload, UserUpdatePayload } from "../services/user.service";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
    staleTime: 1000 * 60 * 2,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreatePayload) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UserUpdatePayload }) =>
      userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: { full_name: string; email: string }) =>
      userService.updateProfile(data),
  });
};
