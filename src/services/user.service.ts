import api from "../api/axios";
import type { User } from "../types/auth";

export interface UserCreatePayload {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
}

export interface UserUpdatePayload {
  full_name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

class UserService {
  // Update own profile
  async updateProfile(data: { full_name: string; email: string }): Promise<User> {
    const response = await api.put<User>("/auth/me", data);
    return response.data;
  }

  // Admin: get all users
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  }

  // Admin: create a new user
  async createUser(data: UserCreatePayload): Promise<User> {
    const response = await api.post<User>("/users", data);
    return response.data;
  }

  // Admin: update user role/status/name
  async updateUser(userId: number, data: UserUpdatePayload): Promise<User> {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  }

  // Admin: delete a user
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  }
}

export default new UserService();
