import api from "../api/axios";
import type {
  LoginRequest,
  LoginResponse,
  User,
} from "../types/auth";

class AuthService {
  async login(data: LoginRequest) {
    const body = new URLSearchParams();

    body.append("username", data.username);
    body.append("password", data.password);

    const response = await api.post<LoginResponse>(
      "/auth/login",
      body,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    localStorage.setItem(
      "access_token",
      response.data.access_token
    );

    return response.data;
  }

  async register(data: { full_name: string; email: string; username: string; password: string; role: string }) {
    const response = await api.post<{ access_token: string; user: User }>("/auth/register", data);
    localStorage.setItem("access_token", response.data.access_token);
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get<User>("/auth/me");

    return response.data;
  }

  logout() {
    localStorage.removeItem("access_token");
  }

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  }
}


export default new AuthService();